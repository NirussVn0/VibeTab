<script setup lang="ts">
import { computed, watch, onUnmounted, onMounted, ref } from 'vue'
import { useBackgroundStore } from '../../stores/background.store'
import { BackgroundService } from '../../services/BackgroundService'

const store = useBackgroundStore()

// Debug mode toggle
const showDebug = ref(true)

// Access store properties directly (not through storeToRefs)
const currentBackground = computed(() => store.currentBackground)
const defaultGradient = computed(() => store.defaultGradient)
const blur = computed(() => store.state.blur)

// DEBUG: Watch for ALL state changes
watch(
  () => ({
    id: store.state.currentBackgroundId,
    count: store.state.backgrounds.length,
    bg: store.currentBackground
  }),
  (newVal, oldVal) => {
    console.log('=== [DEBUG] Background State Changed ===')
    console.log('Old ID:', oldVal?.id, '-> New ID:', newVal.id)
    console.log('Backgrounds count:', newVal.count)
    console.log('Current background object:', newVal.bg)
    if (newVal.bg) {
      console.log('  - type:', newVal.bg.type)
      console.log('  - source:', newVal.bg.source)
      console.log('  - version:', newVal.bg.version)
    }
    console.log('========================================')
  },
  { immediate: true, deep: true }
)

const isVideo = computed(() => {
  const result = currentBackground.value && BackgroundService.isVideoType(currentBackground.value.type)
  console.log('[DEBUG] isVideo computed:', result, 'type:', currentBackground.value?.type)
  return result
})

const isImage = computed(() => {
  const result = currentBackground.value && (
    BackgroundService.isImageType(currentBackground.value.type) || 
    currentBackground.value.type === 'url'
  )
  console.log('[DEBUG] isImage computed:', result, 'type:', currentBackground.value?.type)
  return result
})

const backgroundKey = computed(() => {
  if (!currentBackground.value) return 'default'
  const key = `${currentBackground.value.id}-${currentBackground.value.version}`
  console.log('[DEBUG] backgroundKey:', key)
  return key
})

const backgroundImageStyle = computed(() => {
  if (!currentBackground.value || isVideo.value) {
    console.log('[DEBUG] backgroundImageStyle: empty (no bg or is video)')
    return {}
  }
  
  const style = {
    backgroundImage: `url(${currentBackground.value.source})`,
    backgroundSize: currentBackground.value.position || 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }
  
  console.log('[DEBUG] backgroundImageStyle:', JSON.stringify(style))
  return style
})

// Debug info computed
const debugInfo = computed(() => ({
  hasCurrentBg: !!currentBackground.value,
  currentBgId: store.state.currentBackgroundId,
  bgCount: store.state.backgrounds.length,
  bgType: currentBackground.value?.type || 'none',
  bgSource: currentBackground.value?.source?.substring(0, 50) || 'none',
  isVideoResult: isVideo.value,
  isImageResult: isImage.value,
  styleKeys: Object.keys(backgroundImageStyle.value).join(', ') || 'empty'
}))

onMounted(() => {
  console.log('[DEBUG] BackgroundLayer MOUNTED')
  console.log('[DEBUG] Initial state:', debugInfo.value)
})

onUnmounted(() => {
  console.log('[DEBUG] BackgroundLayer UNMOUNTED')
  BackgroundService.revokeAllObjectUrls()
})
</script>

<template>
  <div 
    class="fixed inset-0 z-background overflow-hidden" 
    data-testid="background-layer"
  >
    <!-- DEBUG OVERLAY -->
    <div 
      v-if="showDebug"
      class="fixed top-20 left-4 z-[9999] bg-black/90 text-green-400 p-4 rounded-lg font-mono text-xs max-w-md"
      style="pointer-events: auto;"
    >
      <div class="font-bold text-yellow-400 mb-2">🔍 Background Debug</div>
      <div>hasCurrentBg: {{ debugInfo.hasCurrentBg }}</div>
      <div>currentBgId: {{ debugInfo.currentBgId || 'null' }}</div>
      <div>bgCount: {{ debugInfo.bgCount }}</div>
      <div>bgType: {{ debugInfo.bgType }}</div>
      <div>isVideo: {{ debugInfo.isVideoResult }}</div>
      <div>isImage: {{ debugInfo.isImageResult }}</div>
      <div>styleKeys: {{ debugInfo.styleKeys }}</div>
      <div class="text-blue-400 truncate">source: {{ debugInfo.bgSource }}</div>
      <button 
        @click="showDebug = false" 
        class="mt-2 px-2 py-1 bg-red-600 text-white rounded text-xs"
      >
        Hide Debug
      </button>
    </div>

    <!-- Default Gradient (when no background selected) -->
    <div
      v-if="!currentBackground"
      class="absolute inset-0 transition-opacity duration-700"
      :style="{ background: defaultGradient }"
      data-testid="background-gradient"
    >
      <!-- Debug marker -->
      <div v-if="showDebug" class="absolute bottom-4 left-4 text-xs text-white/50">
        [SHOWING: Default Gradient]
      </div>
    </div>

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
      >
        <!-- Debug marker -->
        <div v-if="showDebug" class="absolute bottom-4 left-4 text-xs text-white/50">
          [SHOWING: Video]
        </div>
      </video>

      <!-- Image Element -->
      <div
        v-else-if="isImage"
        :key="backgroundKey" 
        class="absolute inset-0"
        :style="backgroundImageStyle"
        data-testid="background-image"
      >
        <!-- Debug marker -->
        <div v-if="showDebug" class="absolute bottom-4 left-4 text-xs text-white/50 bg-black/50 px-2 py-1 rounded">
          [SHOWING: Image Background]
        </div>
      </div>

      <!-- Fallback: Neither video nor image -->
      <div
        v-else
        class="absolute inset-0 bg-red-500/50"
        data-testid="background-error"
      >
        <div class="absolute inset-0 flex items-center justify-center text-white">
          ERROR: Background exists but type not recognized: {{ currentBackground?.type }}
        </div>
      </div>
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