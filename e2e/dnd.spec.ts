import { test, expect } from '@playwright/test';

test.describe('Grid Drag and Drop', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the extension environment / storage if needed
    // For now, we assume local dev server works with localStorage fallback
    await page.goto('/');
  });

  test('should allow dragging a widget', async ({ page }) => {
    // Enable Edit Mode
    await page.keyboard.press('Control+e');
    
    const widget = page.locator('.grid-block').first();
    const widgetBox = await widget.boundingBox();
    if (!widgetBox) throw new Error('Widget not found');

    // Drag from center of widget
    await page.mouse.move(widgetBox.x + widgetBox.width / 2, widgetBox.y + widgetBox.height / 2);
    await page.mouse.down();
    
    // Move to right (approx 150px = 1 column + gap)
    await page.mouse.move(widgetBox.x + widgetBox.width / 2 + 150, widgetBox.y + widgetBox.height / 2, { steps: 5 });
    await page.mouse.up();

    // Verify position changed (this might require checking style or store state)
    // For now, we functionally verify no error occurred and the element is still there
    await expect(widget).toBeVisible();
    
    // More precise verification would involve reading the grid position from the component prop or style
    const newBox = await widget.boundingBox();
    expect(newBox?.x).toBeGreaterThan(widgetBox.x);
  });
});
