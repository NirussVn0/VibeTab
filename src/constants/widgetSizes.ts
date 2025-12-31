/**
 * Widget Size Standards
 * 
 * All widgets must use these standardized size presets.
 * Base unit: 16px per grid cell.
 * All dimensions are in grid cells (integer values only).
 */

export const GRID_BASE_PX = 16

export interface WidgetPreset {
  w: number // width in cells
  h: number // height in cells
  label: string
}

export const CLOCK_PRESETS: Record<'small' | 'medium' | 'large', WidgetPreset> = {
  small: { w: 2, h: 2, label: 'Small' },
  medium: { w: 3, h: 3, label: 'Medium' },
  large: { w: 4, h: 4, label: 'Large' }
}

export const SEARCH_PRESETS: Record<'default' | 'wide', WidgetPreset> = {
  default: { w: 6, h: 2, label: 'Default' },
  wide: { w: 8, h: 2, label: 'Wide' }
}

export const WIDGET_DEFAULTS = {
  clock: CLOCK_PRESETS.medium,
  search: SEARCH_PRESETS.default
} as const

export const WIDGET_MIN_SIZE = {
  clock: CLOCK_PRESETS.small,
  search: { w: 4, h: 1, label: 'Minimum' }
} as const
