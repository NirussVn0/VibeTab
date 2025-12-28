<template>
  <transition name="fade">
    <div 
      v-if="uiStore.isLoading"
      class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/50 backdrop-blur-md"
    >
      <div class="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p v-if="uiStore.loadingMessage" class="mt-4 text-white font-medium text-lg animate-pulse">
        {{ uiStore.loadingMessage }}
      </p>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useUIStore } from '../../stores/ui.store'

const uiStore = useUIStore()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
