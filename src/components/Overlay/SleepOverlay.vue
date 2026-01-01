/**
 * SleepOverlay - Full-screen dim overlay during inactivity
 * Fades in when idle, fades out on any user interaction
 */
<script setup lang="ts">
import { useIdleTimer } from '../../composables/useIdleTimer'
import { useSettingsStore } from '../../stores/settings.store'

const settingsStore = useSettingsStore()
const sleepTimeout = 5 * 60 * 1000
const { isIdle } = useIdleTimer(sleepTimeout)
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-1000 ease-out"
    leave-active-class="transition-opacity duration-300 ease-in"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div 
      v-if="isIdle && settingsStore.general.enableSleepMode !== false" 
      class="fixed inset-0 z-[100] bg-black/60 pointer-events-none"
    />
  </Transition>
</template>
