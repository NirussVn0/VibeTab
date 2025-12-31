<script setup lang="ts">
import { computed, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useBackgroundStore } from '../../stores/background.store'
import { BackgroundService } from '../../services/BackgroundService'

const store = useBackgroundStore()
const { currentBackground, defaultGradient, state } = storeToRefs(store)

const isVideo = computed(() =>
  currentBackground.value && BackgroundService.isVideoType(currentBackground.value.type)
)

const isImage = computed(() =>
  currentBackground.value && BackgroundService.isImageType(currentBackground.value.type)
)

// Computed key for forced refresh
// Combines ID and Version to ensure DOM replacement on logic change
const backgroundKey = computed(() => {
    if (!currentBackground.value) return 'default'
    return `${currentBackground.value.id}-${currentBackground.value.version}`
})

const backgroundImageStyle = computed(() => {
  if (!currentBackground.value || isVideo.value) return {}
  
  // Explicit properties, NO shorthand (requirement)
  return {
    backgroundImage: `url(${currentBackground.value.source})`,
    backgroundSize: currentBackground.value.position || 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }
})

onUnmounted(() => {
  BackgroundService.revokeAllObjectUrls()
})
</script>

<template>
  <div class="fixed inset-0 z-background overflow-hidden transition-colors duration-500 bg-background" data-testid="background-layer">
    <!-- Default Gradient -->
    <div
      v-if="!currentBackground"
      class="absolute inset-0 transition-opacity duration-700"
      :style="{ background: defaultGradient }"
    ></div>

    <!-- Active Background -->
    <template v-else>
      <!-- Video Element -->
      <video
        v-if="isVideo"
        :key="backgroundKey"
        :src="currentBackground.source"
        autoplay
        muted
        loop
        playsinline
        class="absolute inset-0 w-full h-full object-cover"
        data-testid="background-video"
      ></video>

      <!-- Image Element -->
      <div
        v-else-if="isImage"
        :key="backgroundKey" 
        class="absolute inset-0 transition-opacity duration-700 from-bg"
        :style="backgroundImageStyle"
        data-testid="background-image"
      ></div>
    </template>

    <!-- Blur & Overlay Layers -->
    <div
      class="absolute inset-0 pointer-events-none transition-backdrop duration-500"
      :style="{
        backdropFilter: `blur(${state.blur}px)`
      }"
    ></div>

    <div class="absolute inset-0 bg-surface/5 opacity-50 pointer-events-none"></div>
  </div>
</template>

<style scoped>
.from-bg {
    /* Helper for transition-opacity from 0 to 1 if needed, though Vue transition handles enter/leave usually */
}
</style>
