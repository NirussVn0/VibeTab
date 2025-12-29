<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useBackgroundStore } from '../../stores/background.store'

const store = useBackgroundStore()
const { currentBackground, defaultGradient, state } = storeToRefs(store)

</script>

<template>
  <div class="fixed inset-0 z-background overflow-hidden transition-colors duration-500 bg-background">
    <!-- fallback gradient -->
    <div 
      v-if="!currentBackground"
      class="absolute inset-0 transition-opacity duration-700"
      :style="{ background: defaultGradient }"
    ></div>

    <!-- Media Background -->
    <div v-else-if="currentBackground" class="absolute inset-0 transition-opacity duration-700">
        <img 
          v-if="currentBackground.type === 'image' || currentBackground.type === 'gif'"
          :src="currentBackground.source"
          class="w-full h-full object-cover"
          alt="Background"
          loading="lazy"
        />
        <video
          v-else-if="currentBackground.type === 'video'"
          :src="currentBackground.source"
          autoplay muted loop playsinline
          class="w-full h-full object-cover"
        ></video>
    </div>

    <!-- Overlay -->
    <div 
      class="absolute inset-0 pointer-events-none transition-backdrop duration-500"
      :style="{ 
        backdropFilter: `blur(${state.blur}px)`
      }"
    ></div>
    
    <!-- Pattern/Texture overlay (optional) -->
    <div class="absolute inset-0 bg-surface/5 opacity-50 pointer-events-none"></div>
  </div>
</template>
