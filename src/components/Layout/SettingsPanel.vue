<template>
  <div class="fixed inset-0 z-50 overflow-hidden pointer-events-none">
    <!-- Backdrop -->
    <transition name="fade">
      <div 
        v-if="uiStore.isSettingsOpen"
        @click="uiStore.closeSettings"
        class="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
      ></div>
    </transition>

    <!-- Panel -->
    <transition name="slide-right">
      <div 
        v-if="uiStore.isSettingsOpen"
        class="absolute right-0 top-0 h-full w-80 bg-surface-dark border-l border-white/10 shadow-2xl pointer-events-auto flex flex-col"
      >
        <!-- Header -->
        <div class="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 class="text-xl font-bold text-white">Settings</h2>
          <button 
            @click="uiStore.closeSettings"
            class="p-2 text-white/50 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6">
          <p class="text-white/50">Settings content coming soon...</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { useUIStore } from '../../stores/ui.store'

const uiStore = useUIStore()
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-right-enter-active, .slide-right-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-right-enter-from, .slide-right-leave-to {
  transform: translateX(100%);
}
</style>
