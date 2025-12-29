<script setup lang="ts">
import { computed } from 'vue'
import type { GridBlock } from '../../types/grid'

const props = defineProps<{
  block: GridBlock
}>()

const style = computed(() => ({
  gridColumnStart: props.block.x + 1,
  gridColumnEnd: `span ${props.block.w}`,
  gridRowStart: props.block.y + 1,
  gridRowEnd: `span ${props.block.h}`,
  zIndex: props.block.zIndex
}))
</script>

<template>
  <div 
    class="grid-block relative rounded-lg bg-surface/50 backdrop-blur-sm border border-border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:bg-surface/80"
    :style="style"
  >
    <div class="h-full w-full p-4 flex flex-col items-center justify-center">
      <span class="text-xs text-text-secondary uppercase tracking-wider mb-2">{{ block.type }}</span>
      <div v-if="block.type === 'clock'" class="text-4xl font-mono text-primary font-bold">12:00</div>
    </div>
  </div>
</template>

<style scoped>
.grid-block {
  will-change: transform, box-shadow;
}
</style>
