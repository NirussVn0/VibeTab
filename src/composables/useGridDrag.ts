/**
 * Composable for grid-based drag and drop functionality.
 * Calculates drop positions dynamically based on rendered cell dimensions.
 */
import { ref, onUnmounted } from 'vue'

export interface DragState {
  isDragging: boolean
  start: { x: number; y: number }
  current: { x: number; y: number }
  offset: { x: number; y: number }
  gridPos: { x: number; y: number }
  dropTarget: { x: number; y: number } | null
  cellSize?: number
}

export function useGridDrag(
  gridCellSize: number = 64, // Default fallback
  gridGap: number = 8,
  onDrop: (id: string, newPos: { x: number; y: number }) => void
) {
  const dragState = ref<DragState | null>(null)
  const draggedId = ref<string | null>(null)
  
  const handleMouseDown = (
    e: MouseEvent, 
    id: string, 
    initialGridPos: { x: number; y: number },
    dimensions: { w: number; h: number } = { w: 1, h: 1 }
  ) => {
    e.preventDefault()
    const target = e.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    const calculatedCellSize = (rect.width - ((dimensions.w - 1) * gridGap)) / dimensions.w

    draggedId.value = id
    dragState.value = {
      isDragging: true,
      start: { x: e.clientX, y: e.clientY },
      current: { x: e.clientX, y: e.clientY },
      offset: { x: e.clientX - rect.left, y: e.clientY - rect.top },
      gridPos: { ...initialGridPos },
      dropTarget: { ...initialGridPos },
      cellSize: calculatedCellSize
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragState.value?.isDragging) return
    
    dragState.value.current = { x: e.clientX, y: e.clientY }

    const activeCellSize = dragState.value.cellSize ?? gridCellSize
    const totalSize = activeCellSize + gridGap
    
    const deltaX = e.clientX - dragState.value.start.x
    const deltaY = e.clientY - dragState.value.start.y
    
    const gridDeltaX = Math.round(deltaX / totalSize)
    const gridDeltaY = Math.round(deltaY / totalSize)
    
    dragState.value.dropTarget = { 
      x: Math.max(0, dragState.value.gridPos.x + gridDeltaX),
      y: Math.max(0, dragState.value.gridPos.y + gridDeltaY)
    }
  }

  const handleMouseUp = () => {
    if (!dragState.value || !draggedId.value) return

    if (dragState.value.dropTarget) {
      onDrop(draggedId.value, dragState.value.dropTarget)
    }
    
    cleanup()
  }

  const cleanup = () => {
    dragState.value = null
    draggedId.value = null
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
  }

  onUnmounted(cleanup)

  return { handleMouseDown, dragState, draggedId }
}

