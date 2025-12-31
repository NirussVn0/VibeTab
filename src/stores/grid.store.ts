import { defineStore } from 'pinia'
import { computed, watch } from 'vue'
import { useStorage } from '../composables/useStorage'
import { useGridConfig } from '../composables/useGridConfig'
import { GridManager } from '../utils/GridManager'
import { HistoryManager } from '../utils/HistoryManager'
import { WIDGET_PRESETS, DEFAULT_WIDGET_CONFIGS } from '../constants/widgetConfig'

import type { GridBlock } from '../types/grid'


export const useGridStore = defineStore('grid', () => {
  // --- State ---
  const { cols, rows } = useGridConfig()
  const { state: widgets } = useStorage<GridBlock[]>('vibetab_widgets', getDefaultWidgets())
  const history = new HistoryManager<GridBlock[]>(20)
  const gridManager = new GridManager(cols.value, rows.value) // Init with current reactive values

  // Keep GridManager updated
  watch([cols, rows], ([newCols, newRows]) => {
    gridManager.setDimensions(newCols, newRows)
  })

  // --- Actions ---

  /**
   * Adds a generic widget to the grid.
   * Auto-finds empty slot if no position provided.
   */
  const addWidget = (widget: GridBlock) => {
    saveStateToHistory()
    
    // Clamp size to current columns
    widget.w = Math.min(widget.w, cols.value)
    widget.h = Math.min(widget.h, rows.value)

    // Ensure valid position if colliding
    if (gridManager.findCollision(widget, widgets.value)) {
      const emptySlot = gridManager.findEmptySlot(widgets.value, widget.w, widget.h)
      widget.x = emptySlot.x
      widget.y = emptySlot.y
    }
    
    // Clamp again just in case findEmptySlot puts it out of bounds (unlikely but safe)
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

    const widget = { ...widgets.value[widgetIndex] } // Clone for validation
    
    // Apply updates
    widget.x = pos.x
    widget.y = pos.y
    if (pos.w) widget.w = Math.min(pos.w, cols.value) // Enforce max width
    if (pos.h) widget.h = Math.min(pos.h, rows.value)

    // Validate bounds
    if (!gridManager.isValidPosition(widget)) return

    // Simple Collision Check (for now, just prevents overlap)
    // Future: Implement "Push" logic
    const collision = gridManager.findCollision(widget, widgets.value)
    if (collision) {
      // For now, reject move if collision
      // console.warn('Collision detected', collision)
      return 
    }

    saveStateToHistory()
    
    // Commit update
    widgets.value[widgetIndex] = {
      ...widgets.value[widgetIndex],
      ...pos,
      w: widget.w, // Ensure clamped values are saved
      h: widget.h,
      updatedAt: Date.now()
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
    undo,
    redo,
    canUndo,
    canRedo
  }
})

// Helper: Default Widgets
function getDefaultWidgets(): GridBlock[] {
  // Use conservative defaults (will be clamped by grid on render/interaction)
  return [
    { 
      id: 'clock-1', 
      type: 'clock', 
      x: 0, 
      y: 0, 
      w: WIDGET_PRESETS.CLOCK.MEDIUM.w, // Prefer Medium as default
      h: WIDGET_PRESETS.CLOCK.MEDIUM.h,
      config: { ...DEFAULT_WIDGET_CONFIGS.CLOCK }, 
      isLocked: true, 
      zIndex: 10,
      createdAt: Date.now(),
      updatedAt: Date.now()
    },
    { 
      id: 'search-1', 
      type: 'search', 
      x: 0, 
      y: 3, 
      w: WIDGET_PRESETS.SEARCH.DEFAULT.w, 
      h: WIDGET_PRESETS.SEARCH.DEFAULT.h, 
      config: { ...DEFAULT_WIDGET_CONFIGS.SEARCH }, 
      isLocked: false, 
      zIndex: 10,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  ]
}
