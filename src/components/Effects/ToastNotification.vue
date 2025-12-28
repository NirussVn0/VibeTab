<template>
  <div class="fixed bottom-6 right-6 z-[90] flex flex-col gap-2 pointer-events-none">
    <transition-group name="list">
      <div 
        v-for="toast in uiStore.toasts" 
        :key="toast.id"
        class="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-md border border-white/10 min-w-[300px]"
        :class="[
          toast.type === 'success' ? 'bg-green-500/20 text-green-100' :
          toast.type === 'error' ? 'bg-red-500/20 text-red-100' :
          toast.type === 'warning' ? 'bg-yellow-500/20 text-yellow-100' :
          'bg-blue-500/20 text-blue-100'
        ]"
      >
        <!-- Icons -->
        <span v-if="toast.type === 'success'" class="text-xl">✅</span>
        <span v-else-if="toast.type === 'error'" class="text-xl">❌</span>
        <span v-else-if="toast.type === 'warning'" class="text-xl">⚠️</span>
        <span v-else class="text-xl">ℹ️</span>

        <p class="text-sm font-medium">{{ toast.message }}</p>

        <button 
          @click="uiStore.removeToast(toast.id)"
          class="ml-auto opacity-50 hover:opacity-100 transition-opacity"
        >
          ✕
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useUIStore } from '../../stores/ui.store'

const uiStore = useUIStore()
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
