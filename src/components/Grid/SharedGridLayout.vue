<script setup lang="ts" generic="T extends { id: string | number; x: number; y: number; w: number; h: number; minW?: number; minH?: number; maxW?: number; maxH?: number }">
import { computed } from 'vue'
import { useGridDrag } from '../../composables/useGridDrag'
import { useGridResize } from '../../composables/useGridResize'

const props = defineProps<{
  items: T[]
  cols: number
  rows: number
  cellPx: number
  gap: number
  isEditMode: boolean
  containerClass?: string
  dragPreviewClass?: string
}>()

const emit = defineEmits<{
  (e: 'update:item', id: string, changes: { x: number; y: number; w?: number; h?: number }): void
  (e: 'drag-start', id: string): void
  (e: 'drag-end', id: string): void
  (e: 'resize-start', id: string): void
  (e: 'resize-end', id: string): void
}>()

// --- Logic from Normal Mode (GridContainer) reused here ---

// Drag
const { handleMouseDown, dragState, draggedId } = useGridDrag(
  props.cellPx,
  props.gap,
  (id, newPos) => {
    emit('update:item', id, newPos)
    emit('drag-end', id)
  }
)

// Resize
const { handleResizeStart, resizeState, resizingId } = useGridResize(
  props.cellPx,
  props.gap,
  (id, newDim) => {
    emit('update:item', id, { ...newDim, x: -1, y: -1 }) // x/y ignored by store usually, but passed for type safety
    emit('resize-end', id)
  }
)

const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${props.cols}, ${props.cellPx}px)`,
  gridTemplateRows: `repeat(${props.rows}, ${props.cellPx}px)`,
  gap: `${props.gap}px`,
  width: '100%',
  height: '100%'
}))

const getDraggedItem = () => props.items.find(i => String(i.id) === draggedId.value)

// Expose handlers to slots
const onDragStart = (e: MouseEvent, id: string | number, pos: {x:number, y:number}, dim: {w:number, h:number}) => {
  if (!props.isEditMode) return
  handleMouseDown(e, String(id), pos, dim)
  emit('drag-start', String(id))
}

const onResizeStart = (e: MouseEvent, id: string | number, dim: {w:number, h:number}, corner: 'tl'|'tr'|'bl'|'br') => {
  if (!props.isEditMode) return
  handleResizeStart(e, String(id), dim, corner)
  emit('resize-start', String(id))
}
</script>

<template>
  <div class="relative w-full h-full select-none" :class="containerClass">
    <div
      class="w-full h-full relative transition-all"
      :style="gridStyle"
      role="grid"
    >
      <slot
        name="default"
        :onDragStart="onDragStart"
        :onResizeStart="onResizeStart"
        :draggedId="draggedId"
        :resizingId="resizingId"
        :resizeState="resizeState"
      />

      <!-- Drag Preview (Placeholder) -->
      <div
        v-if="dragState && dragState.dropTarget"
        class="pointer-events-none rounded-lg z-10 transition-all duration-100 ease-out"
        :class="dragPreviewClass || 'bg-primary-500/10 border-2 border-dashed border-primary-500/30'"
        :style="{
          gridColumnStart: dragState.dropTarget.x + 1,
          gridColumnEnd: `span ${getDraggedItem()?.w || 1}`,
          gridRowStart: dragState.dropTarget.y + 1,
          gridRowEnd: `span ${getDraggedItem()?.h || 1}`,
        }"
      ></div>

      <!-- Dragged Item Follower -->
      <div
        v-if="dragState && dragState.isDragging"
        class="fixed pointer-events-none z-[100] origin-top-left"
        :style="{
          left: `${dragState.current.x - dragState.offset.x}px`,
          top: `${dragState.current.y - dragState.offset.y}px`,
          width: `${(getDraggedItem()?.w || 1) * cellPx + ((getDraggedItem()?.w || 1) - 1) * gap}px`,
          height: `${(getDraggedItem()?.h || 1) * cellPx + ((getDraggedItem()?.h || 1) - 1) * gap}px`,
          transform: 'scale(1.02)',
        }"
      >
        <slot name="drag-follower" :item="getDraggedItem()" />
      </div>
    </div>
  </div>
</template>
