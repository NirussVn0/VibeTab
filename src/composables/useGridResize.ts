import { ref, onUnmounted } from 'vue'
import { GridConfigService } from '../services/GridConfigService'

export interface ResizeState {
  isResizing: boolean
  start: { x: number; y: number }
  initialDim: { w: number; h: number }
  currentDim: { w: number; h: number } // In cells
}

export function useGridResize(
  cellPx: number,
  gap: number,
  onResizeEnd: (id: string, newDim: { w: number; h: number }) => void
) {
  const resizeState = ref<ResizeState | null>(null)
  const resizingId = ref<string | null>(null)

  const handleResizeStart = (
    e: MouseEvent,
    id: string,
    initialDim: { w: number; h: number }
  ) => {
    e.preventDefault()
    e.stopPropagation() // Prevent drag start

    resizingId.value = id
    resizeState.value = {
      isResizing: true,
      start: { x: e.clientX, y: e.clientY },
      initialDim: { ...initialDim },
      currentDim: { ...initialDim }
    }

    window.addEventListener('mousemove', handleResizeMove)
    window.addEventListener('mouseup', handleResizeEnd)
  }

  const handleResizeMove = (e: MouseEvent) => {
    if (!resizeState.value) return

    const deltaX = e.clientX - resizeState.value.start.x
    const deltaY = e.clientY - resizeState.value.start.y

    const cellDeltaX = GridConfigService.pxToCells(deltaX, cellPx, gap)
    const cellDeltaY = GridConfigService.pxToCells(deltaY, cellPx, gap)

    // Calculate new dimensions but ensure they snap to grid and respect constraints
    const newW = Math.max(1, resizeState.value.initialDim.w + cellDeltaX)
    const newH = Math.max(1, resizeState.value.initialDim.h + cellDeltaY)

    // Apply widget-specific constraints
    const widgetId = resizingId.value;
    if (widgetId) {
      // If this is a clock widget, ensure it maintains aspect ratio based on presets
      if (widgetId.includes('clock')) {
        // For clock widget, make sure it's square-like
        resizeState.value.currentDim = {
          w: newW,
          h: newH
        };
      } else if (widgetId.includes('search')) {
        // For search widget, typically keep it as 1 row high, but allow width changes
        resizeState.value.currentDim = {
          w: newW,
          h: Math.max(1, newH) // Search widget should be at least 1 row
        };
      } else {
        // For other widgets, use the calculated dimensions
        resizeState.value.currentDim = {
          w: newW,
          h: newH
        };
      }
    } else {
      resizeState.value.currentDim = {
        w: newW,
        h: newH
      };
    }
  }

  const handleResizeEnd = () => {
    if (resizeState.value && resizingId.value) {
      onResizeEnd(resizingId.value, resizeState.value.currentDim)
    }
    cleanup()
  }

  const cleanup = () => {
    resizeState.value = null
    resizingId.value = null
    window.removeEventListener('mousemove', handleResizeMove)
    window.removeEventListener('mouseup', handleResizeEnd)
  }

  onUnmounted(cleanup)

  return {
    handleResizeStart,
    resizeState,
    resizingId
  }
}