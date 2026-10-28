'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    // In development: ensure stale service workers don't interfere with HMR or cause reload loops
    if (process.env.NODE_ENV !== 'production') {
      navigator.serviceWorker
        .getRegistrations()
        .then(registrations => {
          registrations.forEach(registration => registration.unregister());
        })
        .catch(() => {});
      return;
    }

    // In production: register service worker safely without reload loops
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }, []);

  return null;
}
