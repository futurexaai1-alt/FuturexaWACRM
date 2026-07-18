import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import type { Contact } from '@/types';

export function useStartConversation() {
  const router = useRouter();
  const { accountId } = useAuth();
  const [isStarting, setIsStarting] = useState(false);
  const supabase = createClient();

  const startConversation = useCallback(
    async (contact: Contact) => {
      if (!accountId) {
        toast.error('Session expired. Please reload the page.');
        return;
      }

      setIsStarting(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        if (!userId) {
          toast.error('Authentication required.');
          return;
        }

        // 1. Check if a conversation already exists
        const { data: existing, error: findError } = await supabase
          .from('conversations')
          .select('id')
          .eq('account_id', accountId)
          .eq('contact_id', contact.id)
          .maybeSingle();

        if (findError) {
          throw findError;
        }

        if (existing) {
          // Conversation exists, just navigate to it
          router.push(`/inbox?c=${existing.id}`);
          return;
        }

        // 2. Create a new conversation
        const { data: newConv, error: createError } = await supabase
          .from('conversations')
          .insert({
            account_id: accountId,
            user_id: userId,
            contact_id: contact.id,
            status: 'open',
            unread_count: 0,
          })
          .select('id')
          .single();

        if (createError) {
          throw createError;
        }

        if (newConv) {
          router.push(`/inbox?c=${newConv.id}`);
        }
      } catch (error) {
        console.error('Failed to start conversation:', error);
        toast.error('Failed to start conversation. Please try again.');
      } finally {
        setIsStarting(false);
      }
    },
    [accountId, router, supabase]
  );

  return { startConversation, isStarting };
}
