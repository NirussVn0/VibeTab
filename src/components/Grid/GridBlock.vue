<script setup lang="ts">
/**
 * GridBlock - Widget container with drag/resize/edit controls
 * Shows settings and delete buttons on hover when in edit mode
 */
import { computed, defineAsyncComponent } from 'vue'
import type { GridBlock } from '../../types/grid'
import type { ClockConfig, SearchConfig, WeatherConfig } from '../../types/widget'
import { Trash2, Settings } from 'lucide-vue-next'

const ClockWidget = defineAsyncComponent(() => import('../Widgets/ClockWidget.vue'))
const SearchWidget = defineAsyncComponent(() => import('../Widgets/SearchWidget.vue'))
const WeatherWidget = defineAsyncComponent(() => import('../Widgets/WeatherWidget.vue'))

const props = defineProps<{
  block: GridBlock
  cellPx: number
  cols: number
  rows: number
  isDragging?: boolean
  isResizing?: boolean
  isEditMode?: boolean
  previewW?: number
  previewH?: number
}>()

const emit = defineEmits<{
  (e: 'drag-start', event: MouseEvent): void
  (e: 'resize-start', event: MouseEvent, corner: 'tl' | 'tr' | 'bl' | 'br'): void
  (e: 'delete'): void
  (e: 'open-settings'): void
}>()

const displayW = computed(() => props.previewW ?? Math.min(props.block.w, props.cols))
const displayH = computed(() => props.previewH ?? Math.min(props.block.h, props.rows))
const displayX = computed(() => Math.min(props.block.x, props.cols - displayW.value))
const displayY = computed(() => Math.min(props.block.y, props.rows - displayH.value))

const style = computed(() => ({
  gridColumn: `${displayX.value + 1} / span ${displayW.value}`,
  gridRow: `${displayY.value + 1} / span ${displayH.value}`,
  zIndex: props.block.zIndex,
  opacity: props.isDragging ? 0.5 : 1,
  width: '100%',
  height: '100%'
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
    class="grid-block relative rounded-lg transition-all duration-200 group"
    :class="{
      'bg-surface/50 backdrop-blur-sm border border-border hover:shadow-lg hover:bg-surface/80': isEditMode,
      'z-50 ring-2 ring-primary': isDragging || isResizing,
      'ring-2 ring-red-500/50': isOutOfBounds,
      'cursor-grab active:cursor-grabbing': isEditMode && !isResizing
    }"
    :style="style"
    @mousedown="!isResizing && emit('drag-start', $event)"
  >
    <div v-if="isEditMode && !block.isLocked" class="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-all z-20">
      <button
        @click.stop="emit('open-settings')"
        class="p-1.5 rounded-full bg-primary-500/80 hover:bg-primary-500 text-white"
        title="Widget Settings"
      >
        <Settings class="w-3 h-3" />
      </button>
      <button
        @click.stop="emit('delete')"
        class="p-1.5 rounded-full bg-red-500/80 hover:bg-red-500 text-white"
        title="Delete Widget"
      >
        <Trash2 class="w-3 h-3" />
      </button>
    </div>

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
      <component
        v-else-if="block.type === 'weather'"
        :is="WeatherWidget"
        :config="block.config as WeatherConfig"
      />

      <div v-else class="h-full w-full p-4 flex flex-col items-center justify-center text-text-secondary">
        <span class="text-xs uppercase tracking-wider mb-2">{{ block.type }}</span>
      </div>
    </div>

    <!-- 4-Corner Resize Handles (only in edit mode, visible on hover) -->
    <template v-if="isEditMode && !block.isLocked">
      <!-- Top-Left -->
      <div
        class="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        @mousedown.stop="emit('resize-start', $event, 'tl')"
      >
        <div class="absolute top-1 left-1 w-2 h-2 bg-primary-500/80 rounded-full"></div>
      </div>
      <!-- Top-Right -->
      <div
        class="absolute top-0 right-0 w-4 h-4 cursor-nesw-resize z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        @mousedown.stop="emit('resize-start', $event, 'tr')"
      >
        <div class="absolute top-1 right-1 w-2 h-2 bg-primary-500/80 rounded-full"></div>
      </div>
      <!-- Bottom-Left -->
      <div
        class="absolute bottom-0 left-0 w-4 h-4 cursor-nesw-resize z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        @mousedown.stop="emit('resize-start', $event, 'bl')"
      >
        <div class="absolute bottom-1 left-1 w-2 h-2 bg-primary-500/80 rounded-full"></div>
      </div>
      <!-- Bottom-Right -->
      <div
        class="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        @mousedown.stop="emit('resize-start', $event, 'br')"
      >
        <div class="absolute bottom-1 right-1 w-2 h-2 bg-primary-500/80 rounded-full"></div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.grid-block {
  will-change: transform, box-shadow;
  min-height: 0;
  min-width: 0;
}
</style>