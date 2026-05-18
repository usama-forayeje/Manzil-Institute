import { test, expect } from '@playwright/test';

// We use a setup that injects a valid session cookie for the admin user
test.describe('Admin Dashboard Authentication', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/dashboard/admin/fees');
    await expect(page).toHaveURL(/.*login/);
  });

  test('should allow access to admin dashboard with super_admin role', async ({ page, context }) => {
    // In a real E2E production scenario, we would use a mock session or real secret
    // For this simulation, we're testing the routing logic
    await context.addCookies([
      {
        name: 'appwrite-session',
        value: 'mock-session-secret',
        domain: 'localhost',
        path: '/',
      },
      {
        name: 'appwrite-user-role',
        value: 'super_admin',
        domain: 'localhost',
        path: '/',
      }
    ]);

    await page.goto('/dashboard/admin/fees');
    // It should NOT redirect to login anymore
    await expect(page).not.toHaveURL(/.*login/);
    await expect(page).toHaveURL(/.*dashboard\/admin\/fees/);
  });
});
