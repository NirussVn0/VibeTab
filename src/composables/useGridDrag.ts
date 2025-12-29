import { ref, onUnmounted } from 'vue'

export interface DragState {
  isDragging: boolean
  start: { x: number; y: number } // Mouse start position
  current: { x: number; y: number } // Mouse current position
  offset: { x: number; y: number } // Offset from top-left of element to mouse
  gridPos: { x: number; y: number } // Calculated grid coordinates
}

export function useGridDrag(
  gridCellSize: number, 
  gridGap: number,
  onDrop: (id: string, newPos: { x: number; y: number }) => void
) {
  const dragState = ref<DragState | null>(null)
  
  // The ID of the item currently being dragged
  const draggedId = ref<string | null>(null)

  const handleMouseDown = (e: MouseEvent, id: string, initialGridPos: { x: number; y: number }) => {
    e.preventDefault() // Prevent text selection
    const target = e.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    
    draggedId.value = id
    dragState.value = {
      isDragging: true,
      start: { x: e.clientX, y: e.clientY },
      current: { x: e.clientX, y: e.clientY },
      offset: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      },
      gridPos: { x: initialGridPos.x, y: initialGridPos.y }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragState.value?.isDragging) return
    
    // Update current mouse position
    dragState.value.current = { x: e.clientX, y: e.clientY }

    // Calculate Grid Position
    // Formula: (MousePos - ContainerOffset) / (CellSize + Gap)
    // Simplified relative calculation:
    // const deltaX = e.clientX - dragState.value.start.x
    // const deltaY = e.clientY - dragState.value.start.y
    
    // We assume the grid starts "relative" to the initial position
    // This part usually requires the container's BCR to be perfect.
    // For now, let's keep it simple: visual drag + drop calculation.
    
    requestAnimationFrame(() => {
        // Optional: Update ghost element visual position here directly if not using Vue binding
    })
  }

  const handleMouseUp = (e: MouseEvent) => {
    if (!dragState.value || !draggedId.value) return

    // Calculate final grid position based on total delta
    // This is a simplified "snap" logic. 
    // Real logic needs reference to the GridContainer's origin.
    
    // For the prototype: We'll calculate "delta grid units"
    const totalSize = gridCellSize + gridGap
    const deltaX = e.clientX - dragState.value.start.x
    const deltaY = e.clientY - dragState.value.start.y
    
    const gridDeltaX = Math.round(deltaX / totalSize)
    const gridDeltaY = Math.round(deltaY / totalSize)
    
    const newX = Math.max(0, dragState.value.gridPos.x + gridDeltaX)
    const newY = Math.max(0, dragState.value.gridPos.y + gridDeltaY)

    onDrop(draggedId.value, { x: newX, y: newY })
    
    cleanup()
  }

  const cleanup = () => {
    dragState.value = null
    draggedId.value = null
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
  }

  onUnmounted(cleanup)

  return {
    handleMouseDown,
    dragState,
    draggedId
  }
}
