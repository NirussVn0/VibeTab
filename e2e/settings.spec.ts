import { test, expect } from '@playwright/test';

test.describe('Settings Persistence', () => {
  test('should toggle dark mode and persist', async ({ page }) => {
    await page.goto('/');

    // Open Command Palette
    await page.keyboard.press('Control+k');

    // Search for Dark Mode
    const input = page.locator('input[placeholder="Type a command or search..."]');
    await input.fill('Dark Mode');
    await page.keyboard.press('Enter');

    // Check if background color changed (simplified check)
    // Assuming dark mode adds a class or specific style, relying on visual persistence test mostly
    
    // Verify Persistence on reload
    await page.reload();
    
    // Check if theme store state is preserved (via localStorage)
    const storedState = await page.evaluate(() => localStorage.getItem('vibetab_theme'));
    expect(storedState).toContain('"mode":"dark"');
  });

  test('should toggle show clock setting', async ({ page }) => {
    await page.goto('/');
    
    // Open Settings Panel (using button or shortcut if implemented, assuming UI interaction here)
    // Finding Settings button might be tricky without specific ID, let's assume Command Palette access for now for reliability
    await page.keyboard.press('Control+k');
    await page.keyboard.press('Escape'); // Close generic if open

    // Manually setting state via console for speed if UI path is complex, 
    // but better to use UI. 
    // Let's use the actual Settings Panel if visible? The button is usually in top bar.
    // Since Top Bar isn't fully implemented in App.vue (it says "Header would go here"), 
    // we use Command Palette to Open Settings.
    
    await page.keyboard.press('Control+k');
    const input = page.locator('input[placeholder="Type a command or search..."]');
    await input.fill('Open Settings');
    await page.keyboard.press('Enter');

    // Toggle Clock
    const toggle = page.locator('button[role="switch"]').first(); // Assuming first toggle is Clock
    const initialState = await toggle.getAttribute('aria-checked');
    await toggle.click();
    expect(await toggle.getAttribute('aria-checked')).not.toBe(initialState);
  });
});
