<script setup lang="ts">
import { computed, watch, onUnmounted } from 'vue'
import { useBackgroundStore } from '../../stores/background.store'
import { BackgroundService } from '../../services/BackgroundService'

const store = useBackgroundStore()

// Access store properties directly (not through storeToRefs)
// This ensures proper reactivity tracking
const currentBackground = computed(() => store.currentBackground)
const defaultGradient = computed(() => store.defaultGradient)
const blur = computed(() => store.state.blur)

// DEBUG: Watch for background changes
watch(
  () => store.state.currentBackgroundId,
  (newId, oldId) => {
    console.log('[BackgroundLayer] currentBackgroundId changed:', oldId, '->', newId)
    console.log('[BackgroundLayer] backgrounds count:', store.state.backgrounds.length)
    console.log('[BackgroundLayer] currentBackground:', store.currentBackground)
  },
  { immediate: true }
)

const isVideo = computed(() =>
  currentBackground.value && BackgroundService.isVideoType(currentBackground.value.type)
)

const isImage = computed(() =>
  currentBackground.value && (BackgroundService.isImageType(currentBackground.value.type) || currentBackground.value.type === 'url')
)

// Computed key for forced refresh
const backgroundKey = computed(() => {
  if (!currentBackground.value) return 'default'
  return `${currentBackground.value.id}-${currentBackground.value.version}`
})

const backgroundImageStyle = computed(() => {
  if (!currentBackground.value || isVideo.value) return {}
  
  console.log('[BackgroundLayer] Building style for:', currentBackground.value.source)
  
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
  <div 
    class="fixed inset-0 z-background overflow-hidden transition-colors duration-500 bg-background" 
    data-testid="background-layer"
  >
    <!-- Default Gradient -->
    <div
      v-if="!currentBackground"
      class="absolute inset-0 transition-opacity duration-700"
      :style="{ background: defaultGradient }"
      data-testid="background-gradient"
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

    <!-- Blur Overlay -->
    <div
      v-if="blur > 0"
      class="absolute inset-0 pointer-events-none"
      :style="{ backdropFilter: `blur(${blur}px)` }"
    ></div>

    <!-- Surface Overlay -->
    <div class="absolute inset-0 bg-surface/5 opacity-50 pointer-events-none"></div>
  </div>
</template>