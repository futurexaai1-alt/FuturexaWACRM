import { createClient } from '@supabase/supabase-js';
import { sendTemplateMessage } from '@/lib/whatsapp/meta-api';
import { resolveVariables, VariableMapping } from '@/lib/broadcasts/variables';
import { isMessageTemplate } from '@/lib/whatsapp/template-row-guard';
import { decrypt } from '@/lib/whatsapp/encryption';
import { Contact } from '@/types';

const SEND_BATCH_SIZE = 10;
const SEND_BATCH_DELAY_MS = 1000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type CustomValueIndex = Map<string, Map<string, string>>;

async function fetchCustomValueIndex(
  admin: any,
  contactIds: string[],
): Promise<CustomValueIndex> {
  const index: CustomValueIndex = new Map();
  if (contactIds.length === 0) return index;

  const PAGE = 500;
  for (let i = 0; i < contactIds.length; i += PAGE) {
    const slice = contactIds.slice(i, i + PAGE);
    const { data } = await admin
      .from('contact_custom_values')
      .select('contact_id, custom_field_id, value')
      .in('contact_id', slice);

    const rows = (data as { contact_id: string; custom_field_id: string; value: string | null }[]) ?? [];

    for (const row of rows) {
      const bucket = index.get(row.contact_id) ?? new Map<string, string>();
      bucket.set(row.custom_field_id, row.value ?? '');
      index.set(row.contact_id, bucket);
    }
  }
  return index;
}

/**
 * Sweeps the database for broadcasts that are ready to send,
 * marks them as sending, and processes them.
 */
export async function processScheduledBroadcasts() {
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. Find broadcasts that are ready to send
  const { data: readyBroadcasts, error: fetchErr } = await admin
    .from('broadcasts')
    .select('*')
    .eq('status', 'scheduled')
    .lte('scheduled_at', new Date().toISOString());

  if (fetchErr) {
    console.error('[broadcast-engine] Failed to fetch scheduled broadcasts:', fetchErr);
    return { processed: 0, error: fetchErr.message };
  }

  if (!readyBroadcasts || readyBroadcasts.length === 0) {
    return { processed: 0 };
  }

  let totalProcessed = 0;

  for (const broadcast of readyBroadcasts) {
    // 2. Mark as sending
    const { error: lockErr } = await admin
      .from('broadcasts')
      .update({ status: 'sending' })
      .eq('id', broadcast.id)
      .eq('status', 'scheduled'); // Optimistic locking

    if (lockErr) {
      console.error(`[broadcast-engine] Failed to lock broadcast ${broadcast.id}:`, lockErr);
      continue;
    }

    try {
      // 3. Load config and template
      const { data: configRow } = await admin
        .from('whatsapp_config')
        .select('*')
        .eq('account_id', broadcast.account_id)
        .maybeSingle();

      const { data: rawTemplateRow } = await admin
        .from('message_templates')
        .select('*')
        .eq('account_id', broadcast.account_id)
        .eq('name', broadcast.template_name)
        .eq('language', broadcast.template_language || 'en_US')
        .maybeSingle();

      const template = rawTemplateRow && isMessageTemplate(rawTemplateRow) ? rawTemplateRow : null;

      if (!configRow || !template) {
        throw new Error('Missing WhatsApp config or template');
      }

      const accessToken = decrypt(configRow.access_token);
      const phoneNumberId = configRow.phone_number_id;

      // 4. Fetch pending recipients
      const { data: recipients, error: recErr } = await admin
        .from('broadcast_recipients')
        .select('*, contact:contacts(*)')
        .eq('broadcast_id', broadcast.id)
        .eq('status', 'pending');

      if (recErr || !recipients || recipients.length === 0) {
        throw new Error('No pending recipients found');
      }

      // Load custom variables if needed
      const variables = (broadcast.template_variables || {}) as Record<string, VariableMapping>;
      const contactIds = recipients.map((r) => r.contact_id).filter(Boolean);
      const customValueIndex = await fetchCustomValueIndex(admin, contactIds);

      let failedCount = broadcast.failed_count || 0;

      // 5. Send in batches
      for (let i = 0; i < recipients.length; i += SEND_BATCH_SIZE) {
        const batch = recipients.slice(i, i + SEND_BATCH_SIZE);

        for (const recipient of batch) {
          const contact = recipient.contact as Contact | null;
          if (!contact || !contact.phone) {
            failedCount++;
            await admin
              .from('broadcast_recipients')
              .update({ status: 'failed', error_message: 'No phone number on contact' })
              .eq('id', recipient.id);
            continue;
          }

          const params = resolveVariables(variables, contact, customValueIndex.get(contact.id));

          try {
            const sendResult = await sendTemplateMessage({
              phoneNumberId,
              accessToken,
              to: contact.phone,
              templateName: template.name,
              language: template.language || 'en_US',
              template,
              messageParams: {
                body: params,
              },
            });

            await admin
              .from('broadcast_recipients')
              .update({
                status: 'sent',
                sent_at: new Date().toISOString(),
                whatsapp_message_id: sendResult.messageId ?? null,
                error_message: null,
              })
              .eq('id', recipient.id);
          } catch (err) {
            failedCount++;
            await admin
              .from('broadcast_recipients')
              .update({
                status: 'failed',
                error_message: err instanceof Error ? err.message : 'Unknown error',
              })
              .eq('id', recipient.id);
          }
        }

        totalProcessed += batch.length;
        if (i + SEND_BATCH_SIZE < recipients.length) {
          await sleep(SEND_BATCH_DELAY_MS);
        }
      }

      // 6. Mark broadcast as finished
      const allFailed = failedCount >= (broadcast.total_recipients || 0);
      await admin
        .from('broadcasts')
        .update({ status: allFailed ? 'failed' : 'sent' })
        .eq('id', broadcast.id);

    } catch (err) {
      console.error(`[broadcast-engine] Broadcast ${broadcast.id} failed completely:`, err);
      await admin
        .from('broadcasts')
        .update({ status: 'failed' })
        .eq('id', broadcast.id);
    }
  }

  return { processed: totalProcessed };
}
