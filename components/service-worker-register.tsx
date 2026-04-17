'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    // Standard dev behavior: ensure stale service workers don't interfere with HMR/navigation
    if (process.env.NODE_ENV !== 'production') {
      navigator.serviceWorker
        .getRegistrations()
        .then(registrations => {
          registrations.forEach(registration => registration.unregister());
        })
        .catch(() => {
          // Silent failure - non-critical in development
        });
      return;
    }

    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Silent failure - SW is optional
    });

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }, []);

  return null; // This component doesn't render anything
}
