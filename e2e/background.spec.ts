import { test, expect } from '@playwright/test';

test.describe('Background System', () => {
  test.beforeEach(async ({ page }) => {
    // Go to root (baseURL is configured in playwright.config.ts)
    await page.goto('/');
    
    // Ensure app is loaded by waiting for the background layer
    const bgLayer = page.getByTestId('background-layer');
    await expect(bgLayer).toBeVisible();
  });

  test('should show default background (gradient) initially', async ({ page }) => {
    const bgLayer = page.getByTestId('background-layer');
    await expect(bgLayer).toBeVisible();
    
    // Default should not have image or video
    await expect(page.getByTestId('background-image')).toBeHidden();
    await expect(page.getByTestId('background-video')).toBeHidden();
  });

  test('should allow adding a background from URL', async ({ page }) => {
    // Open Settings
    await page.getByTestId('open-settings').click();
    
    // Switch to Background Tab
    await page.getByTestId('settings-tab-backgrounds').click();
    
    // Enter Image URL
    const imageUrl = 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?fit=crop&w=800&q=80';
    await page.getByTestId('background-url-input').fill(imageUrl);
    await page.getByTestId('add-background-btn').click();

    // Verify Background Image Appears
    const bgImage = page.getByTestId('background-image');
    await expect(bgImage).toBeVisible();
    
    // Check if style contains the URL (handling css escaping if needed, but strict string check usually works)
    await expect(bgImage).toHaveCSS('background-image', /url/);
  });

  test('should render video element for video backgrounds', async ({ page }) => {
    // Open Settings
    await page.getByTestId('open-settings').click();
    
    // Switch to Background Tab
    await page.getByTestId('settings-tab-backgrounds').click();
    
    // Enter Video URL (mock or real small video)
    const videoUrl = 'https://www.w3schools.com/html/mov_bbb.mp4';
    await page.getByTestId('background-url-input').fill(videoUrl);
    await page.getByTestId('add-background-btn').click();

    // Verify Video Element Appears
    const videoElement = page.getByTestId('background-video');
    await expect(videoElement).toBeVisible();
    await expect(videoElement).toHaveAttribute('src', videoUrl);
    await expect(videoElement).toHaveAttribute('autoplay', '');
  });
});
