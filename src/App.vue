<script setup lang="ts">
import { onMounted, defineAsyncComponent } from 'vue'
import { useThemeStore } from './stores/theme.store'
import { useBackgroundStore } from './stores/background.store'
import { usePomodoroStore } from './stores/pomodoro.store'

import BackgroundLayer from './components/Background/BackgroundLayer.vue'
import GridContainer from './components/Grid/GridContainer.vue'
import ErrorBoundary from './components/Base/ErrorBoundary.vue'
import TopToolbar from './components/Layout/TopToolbar.vue'

const SettingsPanel = defineAsyncComponent(() => import('./components/Layout/SettingsPanel.vue'))
const CommandPalette = defineAsyncComponent(() => import('./components/Overlay/CommandPalette.vue'))
const OnboardingTour = defineAsyncComponent(() => import('./components/Overlay/OnboardingTour.vue'))
const SleepOverlay = defineAsyncComponent(() => import('./components/Overlay/SleepOverlay.vue'))
const EdgeTrigger = defineAsyncComponent(() => import('./components/UI/EdgeTrigger.vue'))
const PomodoroContainer = defineAsyncComponent(() => import('./components/Pomodoro/PomodoroContainer.vue'))

const themeStore = useThemeStore()
const backgroundStore = useBackgroundStore()
const pomodoro = usePomodoroStore()

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
      <SleepOverlay />
      <TopToolbar />
      <BackgroundLayer />

      <div class="relative z-10 w-full h-full">
        <div 
          class="absolute inset-0 transition-all duration-700 ease-out"
          :class="pomodoro.isPomodoroView ? 'opacity-0 pointer-events-none' : 'opacity-100'"
          :style="{
            transform: pomodoro.isPomodoroView ? 'scale(0.92) translateX(-5%)' : 'scale(1) translateX(0)',
            filter: pomodoro.isPomodoroView ? 'blur(12px)' : 'blur(0)'
          }"
        >
          <GridContainer />
        </div>

        <div 
          class="absolute inset-0 transition-all duration-700 ease-out"
          :class="pomodoro.isPomodoroView ? 'opacity-100' : 'opacity-0 pointer-events-none'"
          :style="{ transform: pomodoro.isPomodoroView ? 'translateX(0) scale(1)' : 'translateX(30%) scale(0.95)' }"
        >
          <PomodoroContainer />
        </div>
      </div>

      <EdgeTrigger v-if="!pomodoro.isPomodoroView" side="right" @trigger="pomodoro.enterPomodoroView" />
      <EdgeTrigger v-if="pomodoro.isPomodoroView" side="left" @trigger="pomodoro.exitPomodoroView" />
      
      <div id="modal-portal"></div>
    </main>
  </ErrorBoundary>
</template>
