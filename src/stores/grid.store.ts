import { defineStore } from 'pinia'
import { computed, watch } from 'vue'
import { useStorage } from '../composables/useStorage'
import { useGridConfig } from '../composables/useGridConfig'
import { GridManager } from '../utils/GridManager'
import { HistoryManager } from '../utils/HistoryManager'
import { getClockSize, getSearchSize } from '../constants/widgetSizes'

import type { GridBlock } from '../types/grid'

export type WidgetPosition = 'center' | 'centerH' | 'centerV' | 'left' | 'right' | 'top' | 'bottom' | 'tl' | 'tr' | 'bl' | 'br'

export const useGridStore = defineStore('grid', () => {
  // --- State ---
  const { cols, rows } = useGridConfig()
  const widgets = useStorage<GridBlock[]>('vibetab_widgets', getDefaultWidgets(cols.value, rows.value))
  const history = new HistoryManager<GridBlock[]>(20)
  const gridManager = new GridManager(cols.value, rows.value)

  // Keep GridManager updated
  watch([cols, rows], ([newCols, newRows]) => {
    gridManager.setDimensions(newCols, newRows)
  })

  // --- Actions ---

  const addWidget = (widget: GridBlock) => {
    saveStateToHistory()
    
    widget.w = Math.min(widget.w, cols.value)
    widget.h = Math.min(widget.h, rows.value)

    if (gridManager.findCollision(widget, widgets.value)) {
      const emptySlot = gridManager.findEmptySlot(widgets.value, widget.w, widget.h)
      widget.x = emptySlot.x
      widget.y = emptySlot.y
    }
    
    const clamped = gridManager.clampPosition(widget.x, widget.y, widget.w, widget.h)
    widget.x = clamped.x
    widget.y = clamped.y

    widgets.value.push(widget)
  }

  const removeWidget = (id: string) => {
    saveStateToHistory()
    widgets.value = widgets.value.filter(w => w.id !== id)
  }

  const updateWidgetPosition = (id: string, pos: { x: number, y: number, w?: number, h?: number }) => {
    const widgetIndex = widgets.value.findIndex(w => w.id === id)
    if (widgetIndex === -1) return

    const widget = { ...widgets.value[widgetIndex] }
    
    widget.x = pos.x
    widget.y = pos.y
    if (pos.w) widget.w = Math.min(pos.w, cols.value)
    if (pos.h) widget.h = Math.min(pos.h, rows.value)

    if (!gridManager.isValidPosition(widget)) return

    const collision = gridManager.findCollision(widget, widgets.value)
    if (collision) return

    saveStateToHistory()
    
    widgets.value[widgetIndex] = {
      ...widgets.value[widgetIndex],
      ...pos,
      w: widget.w,
      h: widget.h,
      updatedAt: Date.now()
    }
  }

  /**
   * Position widget to a specific alignment
   */
  const positionWidget = (id: string, position: WidgetPosition) => {
    const widget = widgets.value.find(w => w.id === id)
    if (!widget) return

    let newX = widget.x
    let newY = widget.y

    const maxX = cols.value - widget.w
    const maxY = rows.value - widget.h
    const centerX = Math.floor((cols.value - widget.w) / 2)
    const centerY = Math.floor((rows.value - widget.h) / 2)

    switch (position) {
      case 'center':
        newX = centerX
        newY = centerY
        break
      case 'centerH':
        newX = centerX
        break
      case 'centerV':
        newY = centerY
        break
      case 'left':
        newX = 0
        newY = centerY
        break
      case 'right':
        newX = maxX
        newY = centerY
        break
      case 'top':
        newX = centerX
        newY = 0
        break
      case 'bottom':
        newX = centerX
        newY = maxY
        break
      case 'tl':
        newX = 0
        newY = 0
        break
      case 'tr':
        newX = maxX
        newY = 0
        break
      case 'bl':
        newX = 0
        newY = maxY
        break
      case 'br':
        newX = maxX
        newY = maxY
        break
    }

    // Clamp values
    newX = Math.max(0, Math.min(newX, maxX))
    newY = Math.max(0, Math.min(newY, maxY))

    // Check collision before applying
    const tempWidget = { ...widget, x: newX, y: newY }
    if (!gridManager.findCollision(tempWidget, widgets.value)) {
      updateWidgetPosition(id, { x: newX, y: newY })
    }
  }

  // --- History ---
  const undo = () => {
    const prevState = history.undo(JSON.parse(JSON.stringify(widgets.value)))
    if (prevState) {
      widgets.value = prevState
    }
  }

  const redo = () => {
    const nextState = history.redo(JSON.parse(JSON.stringify(widgets.value)))
    if (nextState) {
      widgets.value = nextState
    }
  }

  const saveStateToHistory = () => {
    history.push(JSON.parse(JSON.stringify(widgets.value)))
  }
  
  // --- Getters ---
  const canUndo = computed(() => history.canUndo)
  const canRedo = computed(() => history.canRedo)

  return {
    widgets,
    addWidget,
    removeWidget,
    updateWidgetPosition,
    positionWidget,
    undo,
    redo,
    canUndo,
    canRedo
  }
})

// Helper: Default Widgets (centered on screen)
function getDefaultWidgets(gridCols: number, gridRows: number): GridBlock[] {
  const clockSize = getClockSize('medium')
  const searchSize = getSearchSize('standard')

  // Calculate centered positions
  const clockX = Math.floor((gridCols - clockSize.w) / 2)
  const clockY = Math.floor((gridRows - clockSize.h - searchSize.h) / 2)
  const searchX = Math.floor((gridCols - searchSize.w) / 2)
  const searchY = clockY + clockSize.h

  return [
    { 
      id: 'clock-1', 
      type: 'clock', 
      x: clockX, y: clockY, 
      w: clockSize.w, 
      h: clockSize.h,
      config: { style: 'digital', format: '24h', showSeconds: true }, 
      isLocked: false, 
      zIndex: 10,
      createdAt: Date.now(),
      updatedAt: Date.now()
    },
    { 
      id: 'search-1', 
      type: 'search', 
      x: searchX, y: searchY, 
      w: searchSize.w, 
      h: searchSize.h,
      config: { provider: 'google', aiMode: false }, 
      isLocked: false, 
      zIndex: 10,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  ]
}