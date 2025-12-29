<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)
const error = ref<Error | null>(null)

onErrorCaptured((err) => {
  hasError.value = true
  error.value = err as Error
  console.error('VibeTab Error:', err)
  // Prevent error from bubbling up
  return false
})

const retry = () => {
  hasError.value = false
  error.value = null
  window.location.reload()
}
</script>

<template>
  <div v-if="hasError" class="fixed inset-0 z-[999] bg-background flex flex-col items-center justify-center p-6 text-center">
    <div class="p-8 rounded-2xl bg-surface border border-red-500/20 max-w-md w-full shadow-2xl">
      <h2 class="text-2xl font-bold text-red-500 mb-4">Something went wrong</h2>
      <p class="text-text-secondary mb-6">
        VibeTab encountered an unexpected error.
      </p>
      
      <div v-if="error" class="bg-black/20 p-4 rounded-lg text-left mb-6 overflow-x-auto">
        <code class="text-xs text-red-400 font-mono">{{ error.message }}</code>
      </div>

      <button 
        @click="retry"
        class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
      >
        Reload VibeTab
      </button>
    </div>
  </div>
  <slot v-else></slot>
</template>
