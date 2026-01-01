/**
 * EdgeTrigger - Hidden edge bar that reveals navigation button on hover
 * Used for sliding between Grid and Pomodoro views
 */
<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

defineProps<{
  side: 'left' | 'right'
}>()

const emit = defineEmits<{
  (e: 'trigger'): void
}>()
</script>

<template>
  <div 
    class="fixed top-0 h-full w-8 z-50 group"
    :class="side === 'right' ? 'right-0' : 'left-0'"
  >
    <div 
      class="absolute inset-y-0 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center"
      :class="side === 'right' ? 'justify-end pr-1' : 'justify-start pl-1'"
    >
      <button
        @click="emit('trigger')"
        class="p-2 rounded-full bg-primary-500/20 backdrop-blur-sm border border-primary-500/30 text-primary-400 hover:bg-primary-500/40 hover:text-white transition-all shadow-lg shadow-primary-500/20"
        :title="side === 'right' ? 'Enter Focus Mode' : 'Exit Focus Mode'"
      >
        <ChevronLeft v-if="side === 'right'" class="w-5 h-5" />
        <ChevronRight v-else class="w-5 h-5" />
      </button>
    </div>
    <div 
      class="absolute inset-y-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      :class="[
        side === 'right' ? 'right-0 bg-gradient-to-l' : 'left-0 bg-gradient-to-r',
        'from-primary-500/50 to-transparent'
      ]"
    />
  </div>
</template>
