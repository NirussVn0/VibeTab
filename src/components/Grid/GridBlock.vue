<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import type { GridBlock } from '../../types/grid'
import type { ClockConfig, SearchConfig } from '../../types/widget'


const ClockWidget = defineAsyncComponent(() => import('../Widgets/ClockWidget.vue'))
const SearchWidget = defineAsyncComponent(() => import('../Widgets/SearchWidget.vue'))

const props = defineProps<{
  block: GridBlock
  cellPx: number
  cols: number
  rows: number
  isDragging?: boolean
  isResizing?: boolean // New prop
  previewW?: number // Visual override during resize
  previewH?: number
}>()

const emit = defineEmits<{
  (e: 'drag-start', event: MouseEvent): void
  (e: 'resize-start', event: MouseEvent): void // New emit
}>()

// Use preview dimensions if resizing, otherwise actual block dimensions
const displayW = computed(() => props.previewW ?? Math.min(props.block.w, props.cols))
const displayH = computed(() => props.previewH ?? Math.min(props.block.h, props.rows))
const displayX = computed(() => Math.min(props.block.x, props.cols - displayW.value))
const displayY = computed(() => Math.min(props.block.y, props.rows - displayH.value))

const style = computed(() => ({
  gridColumn: `${displayX.value + 1} / span ${displayW.value}`,
  gridRow: `${displayY.value + 1} / span ${displayH.value}`,
  zIndex: props.block.zIndex,
  opacity: props.isDragging ? 0.5 : 1
}))

const isOutOfBounds = computed(() => {
  return (
    props.block.x + props.block.w > props.cols ||
    props.block.y + props.block.h > props.rows
  )
})
</script>

<template>
  <div
    class="grid-block relative rounded-lg bg-surface/50 backdrop-blur-sm border border-border transition-all duration-200 hover:shadow-lg hover:bg-surface/80 group"
    :class="{
      'z-50 ring-2 ring-primary': isDragging || isResizing,
      'ring-2 ring-red-500/50': isOutOfBounds,
      'cursor-grab active:cursor-grabbing': !isResizing
    }"
    :style="style"
    @mousedown="!isResizing && emit('drag-start', $event)"
  >
    <!-- Content Container -->
    <div class="h-full w-full overflow-hidden relative">
      <component
        v-if="block.type === 'clock'"
        :is="ClockWidget"
        :config="block.config as ClockConfig"
      />
      <component
        v-else-if="block.type === 'search'"
        :is="SearchWidget"
        :config="block.config as SearchConfig"
      />

      <div v-else class="h-full w-full p-4 flex flex-col items-center justify-center text-text-secondary">
        <span class="text-xs uppercase tracking-wider mb-2">{{ block.type }}</span>
      </div>
    </div>

    <!-- Resize Handle -->
    <div
      v-if="!block.isLocked"
      class="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      @mousedown.stop="emit('resize-start', $event)"
    >
      <div class="w-2 h-2 bg-text-secondary/50 rounded-full"></div>
    </div>
  </div>
</template>

<style scoped>
.grid-block {
  will-change: transform, box-shadow;
  min-height: 0;
  min-width: 0;
}
</style>
