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

    resizeState.value.currentDim = {
      w: Math.max(1, resizeState.value.initialDim.w + cellDeltaX), // Min 1x1
      h: Math.max(1, resizeState.value.initialDim.h + cellDeltaY)
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
