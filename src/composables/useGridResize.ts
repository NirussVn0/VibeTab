import { ref, onUnmounted } from 'vue'
import { GridConfigService } from '../services/GridConfigService'

export type ResizeCorner = 'tl' | 'tr' | 'bl' | 'br'

export interface ResizeState {
  isResizing: boolean
  corner: ResizeCorner
  start: { x: number; y: number }
  initialDim: { w: number; h: number }
  currentDim: { w: number; h: number }
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
    initialDim: { w: number; h: number },
    corner: ResizeCorner = 'br'
  ) => {
    e.preventDefault()
    e.stopPropagation()

    resizingId.value = id
    resizeState.value = {
      isResizing: true,
      corner,
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
    // Apply widget-specific constraints via callback if provided
    if (Math.abs(newW - resizeState.value.currentDim.w) > 0 || Math.abs(newH - resizeState.value.currentDim.h) > 0) {
       resizeState.value.currentDim = {
         w: newW,
         h: newH
       }
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