<script setup lang="ts">
import { onMounted } from 'vue'
import { useThemeStore } from './stores/theme.store'
import { useBackgroundStore } from './stores/background.store'
import BackgroundLayer from './components/Background/BackgroundLayer.vue'
import GridContainer from './components/Grid/GridContainer.vue'
import SettingsPanel from './components/Layout/SettingsPanel.vue'
import CommandPalette from './components/Overlay/CommandPalette.vue'
import OnboardingTour from './components/Overlay/OnboardingTour.vue'
import ErrorBoundary from './components/Base/ErrorBoundary.vue'

const themeStore = useThemeStore()
const backgroundStore = useBackgroundStore()

onMounted(async () => {
  themeStore.applyTheme()
  await backgroundStore.loadBackgrounds()
  
  window.addEventListener('storage', (e) => {
    if (e.key === 'vibetab-theme-mode') {
      themeStore.mode = e.newValue as any
      themeStore.applyTheme()
    }
  })
})
</script>

<template>
  <ErrorBoundary>
    <main class="h-screen w-screen overflow-hidden text-text-primary transition-colors duration-500 relative">
      <CommandPalette />
      <SettingsPanel />
      <OnboardingTour />
      
      <!-- Layer 0: Background -->
      <BackgroundLayer />

      <!-- Layer 1: Main UI -->
      <main class="relative z-10 w-full h-full flex flex-col page-load-fade">
        <!-- Top Bar / Header would go here -->
        
        <!-- Center Grid -->
        <div class="flex-1 w-full overflow-hidden page-load-slide">
          <GridContainer />
        </div>

        <!-- Bottom Bar / Footer -->
      </main>
      
      <!-- Modals / Overlays Layer -->
      <div id="modal-portal"></div>
    </main>
  </ErrorBoundary>
</template>
