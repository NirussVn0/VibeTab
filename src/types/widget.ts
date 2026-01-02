export type WidgetType = 'clock' | 'search' | 'weather' | 'bookmarks' | 'todo' | 'calendar';

export interface BaseWidgetConfig {
  transparent?: boolean;
}

export interface ClockConfig extends BaseWidgetConfig {
  format: '12h' | '24h';
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'Mon Jan 01' | 'YYYY-MM-DD' | 'none';
  showSeconds: boolean;
  style: 'digital' | 'analog';
  color?: string;
  timezone?: string;
}

export interface SearchConfig extends BaseWidgetConfig {
  provider: 'google' | 'bing' | 'duckduckgo';
  aiMode: boolean;
}

export interface WeatherConfig extends BaseWidgetConfig {
  unit: 'c' | 'f';
  location?: string;
  city?: string;
  lat?: number;
  lon?: number;
}

export type WidgetConfig = ClockConfig | SearchConfig | WeatherConfig | BaseWidgetConfig; // & others as added
