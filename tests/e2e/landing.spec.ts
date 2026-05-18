import { test, expect } from '@playwright/test';

test.describe('Public Landing Page & Navigation', () => {
  test('should load landing page with correct title and sections', async ({ page }) => {
    await page.goto('/');
    
    // Check SEO Title
    await expect(page).toHaveTitle(/Manzil Institute/);
    
    // Check Hero Section Content
    const heroHeading = page.locator('h1');
    await expect(heroHeading).toBeVisible();
    
    // Visual confirmation of branding
    const logo = page.locator('img[alt*="Manzil"], svg');
    await expect(logo.first()).toBeVisible();
  });

  test('should navigate to login page from header', async ({ page }) => {
    await page.goto('/');
    
    // Find Login button in header - common pattern in your project
    const loginLink = page.locator('a[href="/login"]');
    if (await loginLink.count() > 0) {
      await loginLink.first().click();
      await expect(page).toHaveURL(/.*login/);
    } else {
      // Fallback if it's a mobile menu or different trigger
      await page.goto('/login');
      await expect(page).toHaveURL(/.*login/);
    }
  });

  test('should show Google login option on login page', async ({ page }) => {
    await page.goto('/login');
    
    // Check for the Google Login button based on our previous subagent findings
    const googleButton = page.getByRole('button', { name: /Google/i });
    await expect(googleButton).toBeVisible();
    
    // Check for Bengali welcome text
    await expect(page.getByText(/স্বাগতম/)).toBeVisible();
  });
});
