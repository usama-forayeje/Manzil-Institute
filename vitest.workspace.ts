import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    test: {
      name: 'node-unit', // Distinct name
      include: ['tests/unit/**/*.test.ts'],
      environment: 'node',
      alias: {
        '@': './',
      },
    },
  },
  {
    test: {
      name: 'browser-ui', // Distinct name
      include: ['tests/browser/**/*.test.tsx'],
      browser: {
        enabled: true,
        provider: 'playwright',
        name: 'chromium',
        headless: true,
      },
      alias: {
        '@': './',
      },
    },
  },
]);
