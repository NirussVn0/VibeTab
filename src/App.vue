<template>
  <div class="relative w-screen h-screen overflow-hidden text-text-primary">
    <!-- Background Layer -->
    <AnimatedBackground />

    <!-- Application Shell -->
    <div class="relative z-0 h-full flex flex-col">
      <TopBar />
      
      <main class="flex-1 relative overflow-hidden">
        <MainGrid />
      </main>
    </div>

    <!-- Overlays -->
    <SettingsPanel />
    <LoadingOverlay />
    <ToastNotification />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AnimatedBackground from './components/Effects/AnimatedBackground.vue'
import LoadingOverlay from './components/Effects/LoadingOverlay.vue'
import ToastNotification from './components/Effects/ToastNotification.vue'
import TopBar from './components/Layout/TopBar.vue'
import MainGrid from './components/Layout/MainGrid.vue'
import SettingsPanel from './components/Layout/SettingsPanel.vue'
import { useUIStore } from './stores/ui.store'

const uiStore = useUIStore()

onMounted(() => {
  // Simulate initial load
  uiStore.startLoading('Welcome to VibeTab')
  setTimeout(() => {
    uiStore.stopLoading()
    uiStore.addToast({
      message: 'VibeTab Optimized & Ready',
      type: 'success'
    })
  }, 1500)
})
</script>
