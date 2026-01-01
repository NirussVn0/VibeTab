/**
 * App.vue - Root component with Grid/Pomodoro view switching
 * Uses translateX for smooth slide transitions, background stays fixed
 */
<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useThemeStore } from './stores/theme.store'
import { useBackgroundStore } from './stores/background.store'
import { usePomodoroStore } from './stores/pomodoro.store'
import BackgroundLayer from './components/Background/BackgroundLayer.vue'
import GridContainer from './components/Grid/GridContainer.vue'
import PomodoroContainer from './components/Pomodoro/PomodoroContainer.vue'
import SettingsPanel from './components/Layout/SettingsPanel.vue'
import CommandPalette from './components/Overlay/CommandPalette.vue'
import OnboardingTour from './components/Overlay/OnboardingTour.vue'
import ErrorBoundary from './components/Base/ErrorBoundary.vue'
import EdgeTrigger from './components/UI/EdgeTrigger.vue'

const themeStore = useThemeStore()
const backgroundStore = useBackgroundStore()
const pomodoro = usePomodoroStore()

const viewTransform = computed(() => 
  pomodoro.isPomodoroView ? 'translateX(-100%)' : 'translateX(0)'
)

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
      
      <BackgroundLayer />

      <div 
        class="relative z-10 w-[200%] h-full flex transition-transform duration-500 ease-out"
        :style="{ transform: viewTransform }"
      >
        <div class="w-1/2 h-full flex flex-col page-load-fade">
          <div class="flex-1 w-full overflow-hidden page-load-slide">
            <GridContainer />
          </div>
        </div>

        <div class="w-1/2 h-full">
          <PomodoroContainer />
        </div>
      </div>

      <EdgeTrigger 
        v-if="!pomodoro.isPomodoroView" 
        side="right" 
        @trigger="pomodoro.enterPomodoroView" 
      />
      <EdgeTrigger 
        v-if="pomodoro.isPomodoroView" 
        side="left" 
        @trigger="pomodoro.exitPomodoroView" 
      />
      
      <div id="modal-portal"></div>
    </main>
  </ErrorBoundary>
</template>

