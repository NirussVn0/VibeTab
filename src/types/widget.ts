export type WidgetType = 'clock' | 'search' | 'weather' | 'bookmarks' | 'todo' | 'calendar';

export interface BaseWidgetConfig {
  transparent?: boolean;
}

export interface ClockConfig extends BaseWidgetConfig {
  format: '12h' | '24h';
  showSeconds: boolean;
  style: 'digital' | 'analog';
  timezone?: string;
}

export interface SearchConfig extends BaseWidgetConfig {
  provider: 'google' | 'bing' | 'duckduckgo';
  aiMode: boolean;
}

export interface WeatherConfig extends BaseWidgetConfig {
  unit: 'c' | 'f';
  city?: string;
  lat?: number;
  lon?: number;
}

export type WidgetConfig = ClockConfig | SearchConfig | WeatherConfig | BaseWidgetConfig; // & others as added
