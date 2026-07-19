import { useEffect, useState } from 'react';
import { requestForToken, onMessageListener } from '@/lib/firebase/client';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

export function usePushNotifications() {
  const [notificationPermission, setNotificationPermission] = useState<string>('');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Determine platform
    const platform = Capacitor.getPlatform(); // 'web', 'ios', 'android'

    const initPush = async () => {
      if (platform === 'web') {
        await initWebPush();
      } else {
        await initCapacitorPush(platform);
      }
    };

    initPush();
  }, []);

  const registerTokenWithBackend = async (tokenString: string, platform: string) => {
    try {
      await fetch('/api/push/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenString, platform }),
      });
      console.log('Push token registered with backend');
    } catch (err) {
      console.error('Failed to register push token with backend:', err);
    }
  };

  const initWebPush = async () => {
    try {
      // Register Service Worker and pass config
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        
        // Pass firebase config to service worker
        if (registration.active) {
          registration.active.postMessage({
            type: 'FIREBASE_CONFIG',
            config: {
              apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
              authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
              projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
              storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
              messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
              appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
              measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
            }
          });
        }
      }

      // Request permission and get token
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        const currentToken = await requestForToken();
        if (currentToken) {
          setToken(currentToken);
          await registerTokenWithBackend(currentToken, 'web');
        }
      }

      // Listen for foreground messages
      onMessageListener().then((payload: any) => {
        console.log('Received foreground message:', payload);
        // We could trigger a toast here if we wanted
      }).catch(err => console.log('failed: ', err));

    } catch (err) {
      console.error('Failed to init Web Push:', err);
    }
  };

  const initCapacitorPush = async (platform: string) => {
    try {
      // Request permission
      let permStatus = await PushNotifications.checkPermissions();
      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      setNotificationPermission(permStatus.receive);

      if (permStatus.receive === 'granted') {
        // Register with Apple / Google to receive token
        await PushNotifications.register();
      }

      // Add listeners
      PushNotifications.addListener('registration', async (tokenData) => {
        setToken(tokenData.value);
        await registerTokenWithBackend(tokenData.value, platform);
      });

      PushNotifications.addListener('registrationError', (error) => {
        console.error('Push registration error:', error);
      });

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push received:', notification);
      });

      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push action performed:', notification);
        // Handle deep linking / routing here
      });

    } catch (err) {
      console.error('Failed to init Capacitor Push:', err);
    }
  };

  return { notificationPermission, token };
}
