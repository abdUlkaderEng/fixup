'use client';

import { useFCM } from '@/hooks';

/**
 * Client Component boundary for FCM.
 * Renders nothing — exists only to call useFCM() from a Server Component layout.
 */
export function FCMProvider() {
   useFCM();
   return null;
}

export default FCMProvider;
