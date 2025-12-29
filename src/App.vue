<template>
  <div class="dark relative w-screen h-screen overflow-hidden bg-surface text-text-primary">
    <!-- Background Layer -->
    <AnimatedBackground />

    <!-- Application Shell -->
    <div class="relative z-10 h-full flex flex-col">
      <TopBar />
      
      <main class="flex-1 relative overflow-hidden">
        <MainGrid />
      </main>
    </div>

    <!-- Overlays -->
    <SettingsPanel />
    <CommandPalette />
    <LoadingOverlay />
    <ToastNotification />
    <Footer />
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
import Footer from './components/Layout/Footer.vue'
import CommandPalette from './components/Widgets/CommandPalette.vue'
import { useUIStore } from './stores/ui.store'
import { useCommandPalette } from './composables/useCommandPalette'

const uiStore = useUIStore()
useCommandPalette()

onMounted(() => {
  uiStore.startLoading('Welcome to VibeTab')
  setTimeout(() => {
    uiStore.stopLoading()
    uiStore.addToast({
      message: 'VibeTab Ready',
      type: 'success'
    })
  }, 1000)
})
</script>
