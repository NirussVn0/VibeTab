<script setup lang="ts">
import { ref, computed, provide, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useGridStore, type WidgetPosition } from '../../stores/grid.store'
import { useGridConfig } from '../../composables/useGridConfig'
import { useGridDrag } from '../../composables/useGridDrag'
import { useGridResize } from '../../composables/useGridResize'
import { useUIStore } from '../../stores/ui.store'
import GridBlock from './GridBlock.vue'
import ContextMenu from '../UI/ContextMenu.vue'
import { Cog6ToothIcon } from '@heroicons/vue/24/outline'

const gridStore = useGridStore()
const uiStore = useUIStore()
const { widgets } = storeToRefs(gridStore)

const { config, cellPx, cols, rows, gap, zoomFactor } = useGridConfig()

provide('gridConfig', config)

const isEditMode = ref(false)
const contextMenu = ref<{ x: number; y: number; blockId: string } | null>(null)

// Drag Logic
const { handleMouseDown, dragState, draggedId } = useGridDrag(
  cellPx.value,
  gap,
  (id, newPos) => {
    gridStore.updateWidgetPosition(id, newPos)
  }
)

// Resize Logic
const { handleResizeStart, resizeState, resizingId } = useGridResize(
  cellPx.value,
  gap,
  (id, newDim) => {
    const widget = widgets.value.find(w => w.id === id)
    if (widget) {
      gridStore.updateWidgetPosition(id, { ...newDim, x: widget.x, y: widget.y })
    }
  }
)

const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${cols.value}, ${cellPx.value}px)`,
  gridTemplateRows: `repeat(${rows.value}, ${cellPx.value}px)`,
  gap: `${gap}px`,
  width: '100%',
  height: '100%'
}))

const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value
}

const onContextMenu = (e: MouseEvent, blockId: string) => {
  // Only show context menu in edit mode
  if (!isEditMode.value) return
  e.preventDefault()
  contextMenu.value = { x: e.clientX, y: e.clientY, blockId }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key === 'e') {
    e.preventDefault()
    toggleEditMode()
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

// Position widget helper
const positionWidget = (position: WidgetPosition) => {
  if (contextMenu.value) {
    gridStore.positionWidget(contextMenu.value.blockId, position)
    contextMenu.value = null
  }
}

const menuItems = [
  { label: 'Center', icon: 'center', action: () => positionWidget('center') },
  { label: 'Left', icon: 'left', action: () => positionWidget('left') },
  { label: 'Right', icon: 'right', action: () => positionWidget('right') },
  { label: 'Top', icon: 'up', action: () => positionWidget('top') },
  { label: 'Bottom', icon: 'down', action: () => positionWidget('bottom') },
  {
    label: 'Delete',
    icon: 'trash',
    destructive: true,
    action: () => {
      if (contextMenu.value?.blockId) {
        gridStore.removeWidget(contextMenu.value.blockId)
      }
    }
  }
]

const getDraggedWidget = () => widgets.value.find(w => w.id === draggedId.value)
</script>

<template>
  <div class="w-screen h-screen overflow-hidden select-none relative">
    
    <div class="absolute top-4 right-4 z-50 flex items-center gap-2">
      <span class="text-xs text-text-secondary bg-surface/80 px-2 py-1 rounded font-mono">
        {{ cols }}×{{ rows }} | {{ cellPx.toFixed(1) }}px | ×{{ zoomFactor.toFixed(2) }}
      </span>
      <button
        @click="uiStore.openSettings()"
        class="p-1 rounded bg-surface border border-border text-text-secondary hover:text-primary hover:border-primary transition-colors"
        data-testid="open-settings"
        title="Settings"
      >
        <Cog6ToothIcon class="w-5 h-5" />
      </button>
      <button
        @click="toggleEditMode"
        class="px-3 py-1 rounded bg-surface border border-border text-sm hover:bg-surface/80 transition-colors"
        :class="{ 'text-primary border-primary': isEditMode }"
      >
        {{ isEditMode ? 'Done' : 'Edit Layout' }}
      </button>
    </div>

    <div
      class="w-full h-full relative transition-all"
      :style="gridStyle"
      :class="{ 'ring-1 ring-border/30 rounded bg-surface/5': isEditMode }"
      role="grid"
      aria-label="Widget Grid"
    >
      <GridBlock
        v-for="block in widgets"
        :key="block.id"
        :block="block"
        :cell-px="cellPx"
        :cols="cols"
        :rows="rows"
        :is-dragging="draggedId === block.id"
        :is-resizing="resizingId === block.id"
        :is-edit-mode="isEditMode"
        :preview-w="resizingId === block.id && resizeState ? resizeState.currentDim.w : undefined"
        :preview-h="resizingId === block.id && resizeState ? resizeState.currentDim.h : undefined"
        @drag-start="(e: MouseEvent) => isEditMode && handleMouseDown(e, block.id, { x: block.x, y: block.y }, { w: block.w, h: block.h })"
        @resize-start="(e: MouseEvent) => isEditMode && handleResizeStart(e, block.id, { w: block.w, h: block.h })"
        @contextmenu="(e: MouseEvent) => onContextMenu(e, block.id)"
        @delete="gridStore.removeWidget(block.id)"
      />

      <!-- Drag Preview (Placeholder) -->
      <div
        v-if="dragState && dragState.dropTarget"
        class="pointer-events-none rounded-lg bg-text-primary/10 border-2 border-dashed border-text-primary/20 transition-all duration-100 ease-out"
        :style="{
          gridColumnStart: dragState.dropTarget.x + 1,
          gridColumnEnd: `span ${getDraggedWidget()?.w || 1}`,
          gridRowStart: dragState.dropTarget.y + 1,
          gridRowEnd: `span ${getDraggedWidget()?.h || 1}`,
        }"
      ></div>

      <!-- Dragged Item Follower -->
      <div
        v-if="dragState && dragState.isDragging"
        class="fixed pointer-events-none z-[100] origin-top-left"
        :style="{
          left: `${dragState.current.x - dragState.offset.x}px`,
          top: `${dragState.current.y - dragState.offset.y}px`,
          width: `${(getDraggedWidget()?.w || 1) * cellPx + ((getDraggedWidget()?.w || 1) - 1) * gap}px`,
          height: `${(getDraggedWidget()?.h || 1) * cellPx + ((getDraggedWidget()?.h || 1) - 1) * gap}px`,
          transform: 'scale(1.05) rotate(2deg)',
        }"
      >
        <div class="w-full h-full rounded-lg bg-surface/90 backdrop-blur-md border border-primary shadow-2xl flex items-center justify-center text-text-primary">
          <span class="font-bold text-lg">{{ getDraggedWidget()?.type || 'Widget' }}</span>
        </div>
      </div>
    </div>

    <ContextMenu
      v-if="contextMenu"
      :x="contextMenu.x"
      :y="contextMenu.y"
      :items="menuItems"
      @close="contextMenu = null"
    />
  </div>
</template>
