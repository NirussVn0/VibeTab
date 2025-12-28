import { storeToRefs } from 'pinia';
import { useThemeStore } from '@/stores/theme.store';
import { onMounted } from 'vue';

export const useTheme = () => {
  const themeStore = useThemeStore();
  const { mode } = storeToRefs(themeStore);

  onMounted(() => {
    themeStore.applyTheme();
  });

  return {
    mode,
    setTheme: themeStore.setTheme,
    cycleTheme: themeStore.cycleTheme,
  };
};
