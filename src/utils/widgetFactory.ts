import type { Component } from 'vue'
import ClockWidget from '../components/Widgets/ClockWidget.vue'
import SearchBar from '../components/Widgets/SearchBar.vue'
import BookmarksWidget from '../components/Widgets/BookmarksWidget.vue'
import WeatherWidget from '../components/Widgets/WeatherWidget.vue'
import TodoWidget from '../components/Widgets/TodoWidget.vue'

// Widget Registry Map
const widgetRegistry: Record<string, Component> = {
  'clock': ClockWidget,
  'search': SearchBar,
  'bookmarks': BookmarksWidget,
  'weather': WeatherWidget,
  'todo': TodoWidget,
}

/**
 * Factory function to get a widget component by type.
 * Implements a basic Factory Pattern for UI components.
 */
export const WidgetFactory = {
  getComponent(type: string): Component | string {
    const component = widgetRegistry[type]
    
    if (!component) {
      console.warn(`[WidgetFactory]: Unknown widget type "${type}"`)
      return 'div' // Fallback
    }
    
    return component
  }
}
