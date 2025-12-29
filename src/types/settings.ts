export type Theme = 'light' | 'dark' | 'auto';

export interface Settings {
  theme: Theme;
  primaryColor: string; // hex
  accentColor: string; // hex
  backgroundBlur: number; // 0-100
  gridColumns: number; // 8-12
  animationsEnabled: boolean;
  reducedMotion: boolean;
  language: string;
  keyboardShortcut: string; // e.g., "ctrl+space"
  version: string;
}
