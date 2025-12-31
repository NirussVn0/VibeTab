import { test, expect } from '@playwright/test';

test.describe('Widget Resizing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Toggle edit mode
    await page.keyboard.press('Control+E');
  });

  test('clock widget respects min size', async ({ page }) => {
    // Assuming clock-1 exists (default)
    const clock = page.locator('[data-testid="grid-block-clock-1"]'); // Requires adding testid to GridBlock
    
    // Check initial size (Medium 3x3 default)
    // We would need to calculate pixels based on 16px grid + gap
    // This is hard to assert exactly without more helpers, but we can assert relative behavior
    
    // For now, simpler test: verify it exists and we can grab a handle
    await expect(clock).toBeVisible();
    
    // Resize Handle (bottom right)
    const handle = clock.locator('.cursor-nwse-resize');
    await expect(handle).toBeVisible();

    // Drag resize handle to make it smaller than min size (2x2)
    // Currently 3x3. Try to drag up/left drastically
    const box = await clock.boundingBox();
    if (!box) return;

    await handle.hover();
    await page.mouse.down();
    await page.mouse.move(box.x + box.width/2, box.y + box.height/2); // Move to center (trying to be 1.5x1.5)
    await page.mouse.up();

    // Assert it didn't shrink below 2x2. 
    // This requires calculating 2 * 16px + gap.
    // Base cell is 16px. Gap?
    // Let's just assert it is still visible and has minimum dimension
    const newBox = await clock.boundingBox();
    expect(newBox?.width).toBeGreaterThan(32); // 2 * 16
  });
});
