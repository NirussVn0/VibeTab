<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import type { GridBlock } from '../../types/grid'
import type { ClockConfig, SearchConfig } from '../../types/widget'

// Async Components (Code splitting)
const ClockWidget = defineAsyncComponent(() => import('../Widgets/ClockWidget.vue'))
const SearchWidget = defineAsyncComponent(() => import('../Widgets/SearchWidget.vue'))

const props = defineProps<{
  block: GridBlock
  isDragging?: boolean
}>()

const emit = defineEmits<{
  (e: 'drag-start', event: MouseEvent): void
}>()

const style = computed(() => ({
  gridColumnStart: props.block.x + 1,
  gridColumnEnd: `span ${props.block.w}`,
  gridRowStart: props.block.y + 1,
  gridRowEnd: `span ${props.block.h}`,
  zIndex: props.block.zIndex,
  opacity: props.isDragging ? 0.5 : 1
}))
</script>

<template>
  <div 
    class="grid-block relative rounded-lg bg-surface/50 backdrop-blur-sm border border-border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:bg-surface/80 cursor-grab active:cursor-grabbing"
    :class="{ 'z-50 ring-2 ring-primary': isDragging }"
    :style="style"
    @mousedown="emit('drag-start', $event)"
  >
    <!-- Dynamic Widget Rendering -->
    <div class="h-full w-full overflow-hidden">
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
       
       <!-- Fallback / Generic -->
       <div v-else class="h-full w-full p-4 flex flex-col items-center justify-center text-text-secondary">
          <span class="text-xs uppercase tracking-wider mb-2">{{ block.type }}</span>
       </div>
    </div>
  </div>
</template>

<style scoped>
.grid-block {
  will-change: transform, box-shadow;
}
</style>
