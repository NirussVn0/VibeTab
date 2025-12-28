<template>
  <div class="fixed inset-0 w-full h-full -z-50 overflow-hidden" :style="store.backgroundStyle">
    <!-- Video Background -->
    <video 
      v-if="store.config.type === 'video'"
      autoplay 
      loop 
      muted 
      playsinline
      class="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover transform -translate-x-1/2 -translate-y-1/2"
    >
      <source :src="store.config.src" type="video/mp4">
    </video>

    <!-- Image Background -->
    <img 
      v-else-if="store.config.type === 'image'"
      :src="store.config.src"
      class="absolute w-full h-full object-cover"
      alt="Background"
    />

    <!-- Solid/Gradient Color -->
    <div 
      v-else
      class="absolute w-full h-full"
      :style="{ background: store.config.src }"
    ></div>

    <!-- Overlay Layer -->
    <div 
      class="absolute inset-0 transition-colors duration-500"
      :style="store.overlayStyle"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { useBackgroundStore } from '../../stores/background.store'

const store = useBackgroundStore()
</script>
