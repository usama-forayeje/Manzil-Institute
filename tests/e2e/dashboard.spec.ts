import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard Critical Features', () => {
  test.beforeEach(async ({ context }) => {
    // Inject super_admin session for all dashboard tests
    await context.addCookies([
      { name: 'appwrite-session', value: 'mock-session-secret', domain: 'localhost', path: '/' },
      { name: 'appwrite-user-role', value: 'super_admin', domain: 'localhost', path: '/' }
    ]);
  });

  test('Student Management - should load student table and stats', async ({ page }) => {
    await page.goto('/dashboard/admin/students');
    
    // Check Header & Stats
    await expect(page.getByText('শিক্ষার্থী ব্যবস্থাপনা')).toBeVisible();
    await expect(page.getByText('মোট শিক্ষার্থী')).toBeVisible();
    
    // Check Table presence
    const table = page.locator('table');
    await expect(table).toBeVisible();
  });

  test('Fee Management - should load Bulk Invoice Generator wizard', async ({ page }) => {
    await page.goto('/dashboard/admin/fees/generate');
    
    // Check Wizard Step 1 UI
    await expect(page.getByText('বাল্ক ইনভয়েস জেনারেটর')).toBeVisible();
    await expect(page.getByText('ফি টাইপ')).toBeVisible();
    await expect(page.getByText('সেশন (Session)')).toBeVisible();
    
    // Verify Step Indicator
    await expect(page.getByText('কনফিগার')).toBeVisible();
    await expect(page.getByText('প্রিভিউ')).toBeVisible();
    await expect(page.getByText('সম্পন্ন')).toBeVisible();
  });

  test('Academic Settings - should manage sessions', async ({ page }) => {
    await page.goto('/dashboard/admin/academics/sessions');
    
    await expect(page.getByText('সেশন ব্যবস্থাপনা')).toBeVisible();
    
    // Check for "New Session" button
    const addButton = page.getByRole('button', { name: /নতুন সেশন/i });
    await expect(addButton).toBeVisible();
    
    // Open Dialog
    await addButton.click();
    await expect(page.getByText('নতুন সেশন যুক্ত করুন')).toBeVisible();
  });
});
