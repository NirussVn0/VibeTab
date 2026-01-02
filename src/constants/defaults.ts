/**
 * Widget default configurations for reset functionality
 * Used by ContextMenu "Reset Settings" action
 */
import type { ClockConfig, SearchConfig, WeatherConfig } from '../types/widget'

export const DEFAULT_CLOCK_CONFIG: ClockConfig = {
  style: 'digital',
  format: '24h',
  dateFormat: 'Mon Jan 01',
  showSeconds: false,
  color: undefined,
  timezone: undefined
}

export const DEFAULT_SEARCH_CONFIG: SearchConfig = {
  provider: 'google',
  aiMode: false
}

export const DEFAULT_WEATHER_CONFIG: WeatherConfig = {
  unit: 'c',
  location: undefined,
  city: undefined
}

export function getDefaultConfig(type: string) {
  switch (type) {
    case 'clock': return { ...DEFAULT_CLOCK_CONFIG }
    case 'search': return { ...DEFAULT_SEARCH_CONFIG }
    case 'weather': return { ...DEFAULT_WEATHER_CONFIG }
    default: return {}
  }
}
