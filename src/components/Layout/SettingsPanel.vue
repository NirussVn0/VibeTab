<template>
  <div class="fixed inset-0 z-50 overflow-hidden pointer-events-none">
    <!-- Backdrop -->
    <transition name="fade">
      <div 
        v-if="uiStore.isSettingsOpen"
        @click="uiStore.closeSettings"
        class="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
      ></div>
    </transition>

    <!-- Panel -->
    <transition name="slide-right">
      <div 
        v-if="uiStore.isSettingsOpen"
        class="absolute right-0 top-0 h-full w-80 bg-surface-dark border-l border-white/10 shadow-2xl pointer-events-auto flex flex-col"
      >
        <!-- Header -->
        <div class="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 class="text-xl font-bold text-white">Settings</h2>
          <button 
            @click="uiStore.closeSettings"
            class="p-2 text-white/50 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6 space-y-8">
          
          <!-- General Settings -->
          <section>
            <h3 class="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">General</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-white/80">Show Clock</span>
                <ToggleSwitch v-model="settingsStore.general.showClock" />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-white/80">Show Weather</span>
                <ToggleSwitch v-model="settingsStore.general.showWeather" />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-white/80">Show Greeting</span>
                <ToggleSwitch v-model="settingsStore.general.showGreeting" />
              </div>
            </div>
          </section>

          <!-- Theme Settings -->
          <section>
            <h3 class="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Appearance</h3>
            <div class="space-y-3">
              <button 
                v-for="mode in ['dark', 'light', 'gray']" 
                :key="mode"
                @click="themeStore.setTheme(mode as 'light' | 'dark' | 'gray')"
                class="w-full flex items-center justify-between p-3 rounded-xl border transition-all"
                :class="themeStore.mode === mode ? 'bg-primary-500/10 border-primary-500 text-white' : 'bg-white/5 border-transparent text-white/60 hover:bg-white/10'"
              >
                <span class="capitalize">{{ mode }} Mode</span>
                <div 
                  v-if="themeStore.mode === mode"
                  class="w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.5)]"
                ></div>
              </button>
            </div>
          </section>

          <!-- About -->
          <section>
            <h3 class="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">About</h3>
            <div class="bg-white/5 rounded-xl p-4 border border-white/5">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-8 h-8 rounded bg-gradient-to-br from-primary-500 to-secondary-500"></div>
                <div>
                  <div class="font-bold text-white">VibeTab</div>
                  <div class="text-[10px] text-white/50">v0.1.0-alpha</div>
                </div>
              </div>
              <p class="text-xs text-white/60 leading-relaxed">
                Designed for flow state and aesthetics.
              </p>
              <div class="mt-3 flex gap-2">
                <a href="https://github.com/sabiofvibelab/vibetab" target="_blank" class="text-[10px] text-primary-400 hover:text-primary-300">GitHub</a>
                <span class="text-[10px] text-white/20">•</span>
                <a href="#" class="text-[10px] text-primary-400 hover:text-primary-300">Website</a>
              </div>
            </div>
          </section>

        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { useUIStore } from '../../stores/ui.store'
import { useSettingsStore } from '../../stores/settings.store'
import { useThemeStore } from '../../stores/theme.store'
import ToggleSwitch from '../Base/ToggleSwitch.vue'

const uiStore = useUIStore()
const settingsStore = useSettingsStore()
const themeStore = useThemeStore()
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-right-enter-active, .slide-right-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-right-enter-from, .slide-right-leave-to {
  transform: translateX(100%);
}
</style>
