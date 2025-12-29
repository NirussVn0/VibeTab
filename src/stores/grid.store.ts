import { defineStore } from 'pinia'
import { useStorage } from '../composables/useStorage'

import type { GridBlock } from '../types/grid'

export const useGridStore = defineStore('grid', () => {
  // Persist widgets to localStorage
  const widgets = useStorage<GridBlock[]>('vibetab_widgets', [
    // Default Layout
    { 
      id: 'clock-1', 
      type: 'clock', 
      x: 0, y: 0, w: 12, h: 2, 
      config: { style: 'digital', format: '24h', showSeconds: true }, 
      isLocked: true, 
      zIndex: 10,
      createdAt: Date.now(),
      updatedAt: Date.now()
    },
    { 
      id: 'search-1', 
      type: 'search', 
      x: 2, y: 2, w: 8, h: 1, 
      config: { provider: 'google', aiMode: false }, 
      isLocked: false, 
      zIndex: 10,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  ])

  const addWidget = (widget: GridBlock) => {
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
      widget.updatedAt = Date.now()
    }
  }

  return {
    widgets,
    addWidget,
    removeWidget,
    updateWidgetPosition
  }
})
