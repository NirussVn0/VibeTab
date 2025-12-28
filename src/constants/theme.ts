export type ThemeMode = 'light' | 'dark' | 'gray';

export interface ThemeState {
  mode: ThemeMode;
  isCustom: boolean;
}
