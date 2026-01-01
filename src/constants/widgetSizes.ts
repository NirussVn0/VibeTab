/**
 * Widget Size Presets (in grid cells)
 * Each cell is 16px base (adjustable via grid config).
 */

export const GRID_BASE_CELL_PX = 16

export interface WidgetSize {
  w: number
  h: number
}

export const CLOCK_SIZES = {
  small: { w: 8, h: 8 },      // 128px
  medium: { w: 12, h: 12 },   // 192px
  large: { w: 16, h: 16 }     // 256px
} as const satisfies Record<string, WidgetSize>

export const SEARCH_SIZES = {
  compact: { w: 16, h: 3 },   // 256x48px
  standard: { w: 24, h: 3 },  // 384x48px
  wide: { w: 32, h: 3 }       // 512x48px
} as const satisfies Record<string, WidgetSize>

export const WIDGET_DEFAULTS = {
  clock: 'medium' as keyof typeof CLOCK_SIZES,
  search: 'standard' as keyof typeof SEARCH_SIZES
} as const

export type ClockSizePreset = keyof typeof CLOCK_SIZES
export type SearchSizePreset = keyof typeof SEARCH_SIZES

export const getClockSize = (preset: ClockSizePreset = 'medium'): WidgetSize => CLOCK_SIZES[preset]
export const getSearchSize = (preset: SearchSizePreset = 'standard'): WidgetSize => SEARCH_SIZES[preset]
