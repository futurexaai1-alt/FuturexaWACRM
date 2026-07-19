import { adminMessaging } from './firebase/admin';
import { createClient } from './supabase/server';

export async function sendPushNotification(
  userIds: string[],
  title: string,
  body: string,
  data?: Record<string, string>
) {
  try {
    const supabase = await createClient();

    // Fetch all registered tokens for these users
    const { data: tokens, error } = await supabase
      .from('push_tokens')
      .select('token')
      .in('user_id', userIds);

    if (error) {
      console.error('Error fetching push tokens:', error);
      return;
    }

    if (!tokens || tokens.length === 0) {
      return; // No devices registered for this user
    }

    const tokenStrings = tokens.map((t) => t.token);

    // Send multicast message via Firebase Admin SDK
    const message = {
      notification: {
        title,
        body,
      },
      data,
      tokens: tokenStrings,
    };

    const response = await adminMessaging.sendEachForMulticast(message);
    
    // Optional: Handle cleanup of invalid/expired tokens based on response
    if (response.failureCount > 0) {
      const failedTokens: string[] = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(tokenStrings[idx]);
        }
      });
      
      if (failedTokens.length > 0) {
        // Delete invalid tokens from the database
        await supabase
          .from('push_tokens')
          .delete()
          .in('token', failedTokens);
      }
    }
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}
