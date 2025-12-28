import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { ThemeMode } from '@/constants/theme';
import { colorPalette } from '@/constants/colors';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    mode: useStorage<ThemeMode>('vibetab-theme-mode', 'dark'),
  }),
  actions: {
    setTheme(mode: ThemeMode) {
      this.mode = mode;
      this.applyTheme();
    },
    cycleTheme() {
      const modes: ThemeMode[] = ['light', 'dark', 'gray'];
      const currentIndex = modes.indexOf(this.mode);
      const nextIndex = (currentIndex + 1) % modes.length;
      this.setTheme(modes[nextIndex]);
    },
    applyTheme() {
      const root = document.documentElement;
      const theme = colorPalette[this.mode];
      
      // Apply CSS variables
      root.style.setProperty('--color-primary', theme.primary);
      root.style.setProperty('--color-primary-hover', theme.primaryHover);
      root.style.setProperty('--color-primary-active', theme.primaryActive);
      root.style.setProperty('--color-secondary', theme.secondary);
      root.style.setProperty('--color-background', theme.background);
      root.style.setProperty('--color-surface', theme.surface);
      root.style.setProperty('--color-surface-hover', theme.surfaceHover);
      root.style.setProperty('--color-text-primary', theme.text.primary);
      root.style.setProperty('--color-text-secondary', theme.text.secondary);
      root.style.setProperty('--color-text-tertiary', theme.text.tertiary);
      root.style.setProperty('--color-border', theme.border);
      root.style.setProperty('--color-divider', theme.divider);
      root.style.setProperty('--color-blur', theme.blur);
      
      // Update Tailwind class
      if (this.mode === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  },
});
