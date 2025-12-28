<template>
  <div 
    class="relative group rounded-2xl bg-surface-light/10 dark:bg-surface-dark/40 backdrop-blur-md border border-white/5 transition-all duration-300"
    :class="[
      {'hover:bg-surface-light/20 dark:hover:bg-surface-dark/60 hover:shadow-lg': !uiStore.isEditMode},
      {'border-primary-500/50 border-dashed animate-pulse': uiStore.isEditMode}
    ]"
  >
    <!-- Edit Mode Controls -->
    <div 
      v-if="uiStore.isEditMode" 
      class="absolute -top-2 -right-2 z-20 flex gap-1"
    >
      <button 
        @click="$emit('remove')"
        class="p-1 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>

    <!-- Content -->
    <div class="w-full h-full p-4 overflow-hidden">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUIStore } from '../../stores/ui.store'

const uiStore = useUIStore()

defineEmits(['remove'])
</script>
