import { test, expect } from '@playwright/test';

test.describe('Widget Interaction', () => {
  test('should type in search widget', async ({ page }) => {
    await page.goto('/');

    // Locate Search Widget Input
    // Grid Block for search is usually index 1 or by class
    const searchInput = page.locator('input[placeholder="Search..."]'); // SearchWidget has this placeholder
    await expect(searchInput).toBeVisible();

    await searchInput.fill('VibeTab Features');
    await expect(searchInput).toHaveValue('VibeTab Features');
    
    // Test enter key triggers navigation (mocked)
    // We can't easily test actual navigation away without breaking the test context, 
    // but we can spy on window.location or check if method was called if we could instrument app.
    // For E2E, verifying input works is sufficient for now.
  });

  test('should show correct clock format', async ({ page }) => {
    await page.goto('/');
    
    // Locate Clock Widget
    const clockDisplay = page.locator('.text-\\[clamp\\(2rem\\,10vw\\,4rem\\)\\]'); // Main clock text class
    await expect(clockDisplay).toBeVisible();
    
    // Verify it contains a time-like string (e.g. "12:00" or "12:00:00")
    const timeText = await clockDisplay.innerText();
    expect(timeText).toMatch(/\d{1,2}:\d{2}/);
  });
});
