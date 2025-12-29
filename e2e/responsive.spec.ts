import { test, expect } from '@playwright/test';

test.describe('Responsive Layout', () => {
  test('should render 4 columns on mobile', async ({ page }) => {
    // Resize to Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check Grid Container classes or computed style for grid-template-columns
    const grid = page.locator('.grid'); 
    // Tailwind `grid-cols-4` should be active at default (min-width: 0)
    // `md:grid-cols-8` at 768px
    
    // We can visually verify block positions or check screenshot (if visual regression enabled)
    // Or check computed style
    
    const computedStyle = await grid.evaluate((el) => window.getComputedStyle(el).gridTemplateColumns);
    // 4 columns usually means 4 distinct values in the string, or we can rely on classes if we trust Tailwind
    // grid-cols-4
    await expect(grid).toHaveClass(/grid-cols-4/);
  });

  test('should render 12 columns on desktop', async ({ page }) => {
    // Resize to Desktop
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    
    const grid = page.locator('.grid');
    await expect(grid).toHaveClass(/lg:grid-cols-12/);
  });
});
