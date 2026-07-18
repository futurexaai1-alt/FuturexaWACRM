import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/automations/admin-client'
import { decrypt } from '@/lib/whatsapp/encryption'
import { sendTemplateMessage } from '@/lib/whatsapp/meta-api'
import { phoneVariants, sanitizePhoneForMeta, isRecipientNotAllowedError } from '@/lib/whatsapp/phone-utils'
import { resolveVariables, VariableMapping } from '@/lib/broadcasts/variables'
import { isMessageTemplate } from '@/lib/whatsapp/template-row-guard'
import { Contact } from '@/types'

const RETRY_DELAYS_MS = [
  2 * 60 * 60 * 1000,   // retry 1: 2 hours
  8 * 60 * 60 * 1000,   // retry 2: 8 hours
  24 * 60 * 60 * 1000,  // retry 3: 24 hours
]

export async function GET(request: Request) {
  const expected = process.env.AUTOMATION_CRON_SECRET
  if (!expected) {
    return NextResponse.json({ error: 'cron not configured' }, { status: 503 })
  }
  const supplied = request.headers.get('x-cron-secret')
  if (supplied !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = supabaseAdmin()
  
  // Find up to 20 recipients due for retry
  const { data: due, error } = await admin
    .from('broadcast_recipients')
    .select('*, contact:contacts(*), broadcast:broadcasts(*)')
    .eq('status', 'retry_pending')
    .lte('next_retry_at', new Date().toISOString())
    .limit(20)

  if (error) {
    console.error('[broadcast-retry-cron] query failed:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  if (!due || due.length === 0) return NextResponse.json({ processed: 0 })

  console.log(`[broadcast-retry-cron] found ${due.length} due row(s)`)

  let processed = 0
  
  // Group by broadcast to batch template & config lookups
  const broadcasts = new Map<string, any>()
  
  for (const row of due) {
    const broadcast = row.broadcast
    if (!broadcast) continue
    
    if (!broadcasts.has(broadcast.id)) {
      // Load template
      const { data: rawTemplateRow } = await admin
        .from('message_templates')
        .select('*')
        .eq('account_id', broadcast.account_id)
        .eq('name', broadcast.template_name)
        .eq('language', broadcast.template_language || 'en_US')
        .maybeSingle()
        
      // Load config
      const { data: configRow } = await admin
        .from('whatsapp_config')
        .select('*')
        .eq('account_id', broadcast.account_id)
        .maybeSingle()
        
      broadcasts.set(broadcast.id, {
        template: rawTemplateRow && isMessageTemplate(rawTemplateRow) ? rawTemplateRow : null,
        config: configRow
      })
    }
    
    const { template, config } = broadcasts.get(broadcast.id)
    
    // If we can't find config, permanently fail
    if (!config) {
      await admin.from('broadcast_recipients').update({
        status: 'failed',
        error_message: 'WhatsApp not connected',
        next_retry_at: null
      }).eq('id', row.id)
      continue
    }
    
    const accessToken = decrypt(config.access_token)
    const sanitized = sanitizePhoneForMeta(row.contact.phone)
    
    // Build parameters
    const variables = (broadcast.template_variables || {}) as Record<string, VariableMapping>
    
    // We need custom fields if used in variables
    let customValues = new Map<string, string>()
    const hasCustomFields = Object.values(variables).some(v => v.type === 'custom_field')
    if (hasCustomFields) {
      const { data: cvData } = await admin
        .from('contact_custom_values')
        .select('custom_field_id, value')
        .eq('contact_id', row.contact.id)
      
      if (cvData) {
        cvData.forEach(cv => customValues.set(cv.custom_field_id, cv.value || ''))
      }
    }
    
    const params = resolveVariables(variables, row.contact as Contact, customValues)
    
    const messageParams: Record<string, string> = {}
    if (template?.header_type === 'image' && template.header_media_url) {
      messageParams.image_link = template.header_media_url
    } else if (template?.header_type === 'document' && template.header_media_url) {
      messageParams.document_link = template.header_media_url
      messageParams.document_filename = 'document.pdf' // Fallback
    } else if (template?.header_type === 'video' && template.header_media_url) {
      messageParams.video_link = template.header_media_url
    }

    const variants = phoneVariants(sanitized)
    let sentMessageId: string | null = null
    let lastError: string | null = null

    for (const variant of variants) {
      try {
        const result = await sendTemplateMessage({
          phoneNumberId: config.phone_number_id,
          accessToken,
          to: variant,
          templateName: broadcast.template_name,
          language: broadcast.template_language || 'en_US',
          template: template || undefined,
          messageParams: messageParams,
          params: params,
        })
        sentMessageId = result.messageId
        lastError = null
        break
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        if (!isRecipientNotAllowedError(errorMessage)) {
          lastError = errorMessage
          break
        }
        lastError = errorMessage
      }
    }
    
    if (sentMessageId) {
      await admin.from('broadcast_recipients').update({
        status: 'sent',
        whatsapp_message_id: sentMessageId,
        next_retry_at: null,
        error_message: null,
        is_ecosystem_error: false
      }).eq('id', row.id)
      processed++
    } else {
      console.error(`[broadcast-retry-cron] Failed to retry broadcast to ${row.contact.phone}:`, lastError)
      
      const isEcosystemError = lastError?.toLowerCase().includes('healthy ecosystem') || 
                               lastError?.includes('131047') || 
                               lastError?.includes('131056')
                               
      const newRetryCount = row.retry_count + 1
      
      if (isEcosystemError && newRetryCount < 3) {
        await admin.from('broadcast_recipients').update({
          retry_count: newRetryCount,
          next_retry_at: new Date(Date.now() + RETRY_DELAYS_MS[newRetryCount]).toISOString(),
          error_message: lastError
        }).eq('id', row.id)
      } else {
        await admin.from('broadcast_recipients').update({
          status: 'failed',
          retry_count: newRetryCount,
          next_retry_at: null,
          error_message: lastError || 'Unknown error'
        }).eq('id', row.id)
      }
    }
    
    // Slight delay for rate limiting
    await new Promise(resolve => setTimeout(resolve, 250))
  }

  return NextResponse.json({ processed })
}
