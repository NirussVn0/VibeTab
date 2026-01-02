/**
 * SleepOverlay - Full-screen dim overlay during inactivity
 * Uses autoHide settings for timeout, color, and opacity
 */
<script setup lang="ts">
import { computed, watch } from 'vue'
import { useIdleTimer } from '../../composables/useIdleTimer'
import { useSettingsStore } from '../../stores/settings.store'
import { useUIStore } from '../../stores/ui.store'

const settingsStore = useSettingsStore()
const uiStore = useUIStore()

const timeout = computed(() => (settingsStore.autoHide.timeout || 60) * 1000)
const { isIdle } = useIdleTimer(timeout.value)

const isActive = computed(() => 
  settingsStore.autoHide.enabled && isIdle.value
)

const overlayStyle = computed(() => ({
  backgroundColor: settingsStore.autoHide.dimBackground 
    ? settingsStore.autoHide.dimColor || '#000000'
    : 'transparent',
  opacity: settingsStore.autoHide.dimBackground 
    ? settingsStore.autoHide.dimOpacity || 0.6
    : 0
}))

watch(isActive, (active) => {
  uiStore.setWidgetsHidden(active)
})
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-1000 ease-out"
    leave-active-class="transition-opacity duration-300 ease-in"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div 
      v-if="isActive" 
      class="fixed inset-0 z-[100] pointer-events-none"
      :style="overlayStyle"
    />
  </Transition>
</template>

