import { defineStore } from 'pinia'
import { useStorage } from '../composables/useStorage'

export interface WidgetItem {
  id: string
  type: 'clock' | 'search' | 'weather' | 'bookmark' | 'todo'
  x: number
  y: number
  w: number
  h: number
  props?: Record<string, any>
}

export const useGridStore = defineStore('grid', () => {
  // Persist widgets to localStorage
  const widgets = useStorage<WidgetItem[]>('vibetab_widgets', [
    // Default Layout
    { id: 'clock-1', type: 'clock', x: 0, y: 0, w: 12, h: 2, props: {} },
    { id: 'search-1', type: 'search', x: 2, y: 2, w: 8, h: 1, props: {} }
  ])

  const addWidget = (widget: WidgetItem) => {
    widgets.value.push(widget)
  }

  const removeWidget = (id: string) => {
    widgets.value = widgets.value.filter(w => w.id !== id)
  }

  const updateWidgetPosition = (id: string, pos: { x: number, y: number, w?: number, h?: number }) => {
    const widget = widgets.value.find(w => w.id === id)
    if (widget) {
      widget.x = pos.x
      widget.y = pos.y
      if (pos.w) widget.w = pos.w
      if (pos.h) widget.h = pos.h
    }
  }

  return {
    widgets,
    addWidget,
    removeWidget,
    updateWidgetPosition
  }
})
