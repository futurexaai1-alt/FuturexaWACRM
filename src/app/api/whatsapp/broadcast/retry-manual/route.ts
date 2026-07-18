import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { decrypt } from '@/lib/whatsapp/encryption'
import { sendTemplateMessage } from '@/lib/whatsapp/meta-api'
import { phoneVariants, sanitizePhoneForMeta, isRecipientNotAllowedError } from '@/lib/whatsapp/phone-utils'
import { resolveVariables, VariableMapping } from '@/lib/broadcasts/variables'
import { isMessageTemplate } from '@/lib/whatsapp/template-row-guard'
import { Contact } from '@/types'
import { checkRateLimit, rateLimitResponse, RATE_LIMITS } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const limit = checkRateLimit(`broadcast:${user.id}`, RATE_LIMITS.broadcast)
    if (!limit.success) {
      return rateLimitResponse(limit)
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('account_id')
      .eq('user_id', user.id)
      .maybeSingle()
      
    const accountId = profile?.account_id as string | undefined
    if (!accountId) {
      return NextResponse.json(
        { error: 'Your profile is not linked to an account.' },
        { status: 403 },
      )
    }

    const body = await request.json()
    const { broadcast_id, recipient_ids } = body

    if (!broadcast_id) {
      return NextResponse.json({ error: 'broadcast_id is required' }, { status: 400 })
    }

    // Verify broadcast belongs to this account
    const { data: broadcast } = await supabase
      .from('broadcasts')
      .select('*')
      .eq('id', broadcast_id)
      .eq('account_id', accountId)
      .maybeSingle()

    if (!broadcast) {
      return NextResponse.json({ error: 'Broadcast not found' }, { status: 404 })
    }
    
    // Load config
    const { data: configRow } = await supabase
      .from('whatsapp_configs')
      .select('*')
      .eq('account_id', accountId)
      .eq('status', 'connected')
      .maybeSingle()
      
    if (!configRow) {
      return NextResponse.json({ error: 'WhatsApp not connected' }, { status: 400 })
    }
    
    // Load template
    const { data: rawTemplateRow } = await supabase
      .from('message_templates')
      .select('*')
      .eq('account_id', accountId)
      .eq('name', broadcast.template_name)
      .eq('language', broadcast.template_language || 'en_US')
      .maybeSingle()
      
    const template = rawTemplateRow && isMessageTemplate(rawTemplateRow) ? rawTemplateRow : null
    const accessToken = decrypt(configRow.access_token)
    
    let query = supabase
      .from('broadcast_recipients')
      .select('*, contact:contacts(*)')
      .eq('broadcast_id', broadcast_id)
      .in('status', ['failed', 'retry_pending'])
      .or('is_ecosystem_error.eq.true,error_message.ilike.*healthy ecosystem*')
      
    if (recipient_ids && Array.isArray(recipient_ids) && recipient_ids.length > 0) {
      query = query.in('id', recipient_ids)
    }
    
    const { data: due, error } = await query
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    if (!due || due.length === 0) {
      return NextResponse.json({ processed: 0 })
    }
    
    const variables = (broadcast.template_variables || {}) as Record<string, VariableMapping>
    const hasCustomFields = Object.values(variables).some(v => v.type === 'custom_field')
    
    // Batch fetch custom fields if needed
    const customValuesMap = new Map<string, Map<string, string>>()
    if (hasCustomFields) {
      const contactIds = due.map(r => r.contact_id).filter(Boolean) as string[]
      
      const PAGE = 500
      for (let i = 0; i < contactIds.length; i += PAGE) {
        const slice = contactIds.slice(i, i + PAGE)
        const { data: cvData } = await supabase
          .from('contact_custom_values')
          .select('contact_id, custom_field_id, value')
          .in('contact_id', slice)
          
        for (const row of cvData ?? []) {
          const bucket = customValuesMap.get(row.contact_id) ?? new Map<string, string>()
          bucket.set(row.custom_field_id, row.value ?? '')
          customValuesMap.set(row.contact_id, bucket)
        }
      }
    }
    
    const messageParams: Record<string, string> = {}
    if (template?.header_type === 'image' && template.header_media_url) {
      messageParams.image_link = template.header_media_url
    } else if (template?.header_type === 'document' && template.header_media_url) {
      messageParams.document_link = template.header_media_url
      messageParams.document_filename = 'document.pdf'
    } else if (template?.header_type === 'video' && template.header_media_url) {
      messageParams.video_link = template.header_media_url
    }
    
    let processed = 0
    let failedCount = 0
    
    for (const row of due) {
      const sanitized = sanitizePhoneForMeta(row.contact.phone)
      const customValues = customValuesMap.get(row.contact_id)
      const params = resolveVariables(variables, row.contact as Contact, customValues)
      
      const variants = phoneVariants(sanitized)
      let sentMessageId: string | null = null
      let lastError: string | null = null

      for (const variant of variants) {
        try {
          const result = await sendTemplateMessage({
            phoneNumberId: configRow.phone_number_id,
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
        await supabase.from('broadcast_recipients').update({
          status: 'sent',
          whatsapp_message_id: sentMessageId,
          retry_count: 0,
          next_retry_at: null
        }).eq('id', row.id)
        processed++
      } else {
        await supabase.from('broadcast_recipients').update({
          status: 'failed',
          retry_count: 0,
          next_retry_at: null,
          error_message: lastError || 'Unknown error'
        }).eq('id', row.id)
        failedCount++
      }
      
      // Delay for rate limiting
      await new Promise(resolve => setTimeout(resolve, 250))
    }
    
    return NextResponse.json({ processed, failed: failedCount })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    )
  }
}
