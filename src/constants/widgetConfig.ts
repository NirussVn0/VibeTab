export const WIDGET_PRESETS = {
  CLOCK: {
    SMALL: { w: 2, h: 2 },
    MEDIUM: { w: 3, h: 3 },
    LARGE: { w: 4, h: 4 },
  },
  SEARCH: {
    DEFAULT: { w: 6, h: 2 } // Increased height to 2 for better touch targets? Use user baseline 6x2.
  }
} as const

export const DEFAULT_WIDGET_CONFIGS = {
  CLOCK: {
    style: 'digital',
    format: '24h',
    showSeconds: false
  },
  SEARCH: {
    provider: 'google',
    aiMode: false
  }
} as const
