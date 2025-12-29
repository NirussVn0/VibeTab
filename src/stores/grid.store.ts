import { defineStore } from 'pinia'
import { computed } from 'vue' // Removed unused ref, watch
import { useStorage } from '../composables/useStorage'
import { GridManager } from '../utils/GridManager'
import { HistoryManager } from '../utils/HistoryManager'

import type { GridBlock } from '../types/grid'


export const useGridStore = defineStore('grid', () => {
  // --- State ---
  const widgets = useStorage<GridBlock[]>('vibetab_widgets', getDefaultWidgets())
  const history = new HistoryManager<GridBlock[]>(20)
  const gridManager = new GridManager(12) // Default desktop cols, should be reactive to viewport

  // --- Actions ---

  /**
   * Adds a generic widget to the grid.
   * Auto-finds empty slot if no position provided.
   */
  const addWidget = (widget: GridBlock) => {
    saveStateToHistory()
    
    // Ensure valid position if colliding
    if (gridManager.findCollision(widget, widgets.value)) {
      const emptySlot = gridManager.findEmptySlot(widgets.value, widget.w, widget.h)
      widget.x = emptySlot.x
      widget.y = emptySlot.y
    }

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
    if (pos.w) widget.w = pos.w
    if (pos.h) widget.h = pos.h

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
  return [
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
  ]
}
