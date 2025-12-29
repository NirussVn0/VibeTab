<script setup lang="ts">
import { onMounted } from 'vue'
import BackgroundLayer from './components/Background/BackgroundLayer.vue'
import GridContainer from './components/Grid/GridContainer.vue'
import SettingsPanel from './components/Layout/SettingsPanel.vue'
import CommandPalette from './components/Overlay/CommandPalette.vue'
import OnboardingTour from './components/Overlay/OnboardingTour.vue'
import ErrorBoundary from './components/Base/ErrorBoundary.vue'

onMounted(() => {
  console.log('VibeTab Initialized')
})
</script>

<template>
  <ErrorBoundary>
    <main class="h-screen w-screen overflow-hidden text-text-primary bg-background transition-colors duration-500 relative">
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
