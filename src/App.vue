<script setup lang="ts">
import { onMounted } from 'vue'
import BackgroundLayer from './components/Background/BackgroundLayer.vue'
import GridContainer from './components/Grid/GridContainer.vue'

onMounted(() => {
  console.log('VibeTab Initialized')
})
</script>

<template>
  <div class="u-fullscreen flex flex-col relative overflow-hidden">
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
  </div>
</template>
