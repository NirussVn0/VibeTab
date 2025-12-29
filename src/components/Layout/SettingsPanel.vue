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
        class="absolute right-0 top-0 h-full w-[400px] bg-surface-dark border-l border-white/10 shadow-2xl pointer-events-auto flex flex-col"
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

        <!-- Tabs -->
        <div class="flex border-b border-white/5 px-6">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            class="px-4 py-3 text-sm font-medium border-b-2 transition-colors"
            :class="activeTab === tab.id ? 'border-primary-500 text-white' : 'border-transparent text-white/50 hover:text-white/80'"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6 space-y-8">
          
          <!-- Tab: General -->
          <section v-if="activeTab === 'general'" class="space-y-6">
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

            <!-- Weather Location -->
            <div class="space-y-2 pt-4 border-t border-white/5">
              <span class="text-sm text-white/80 block">Weather Location</span>
              <select 
                v-model="settingsStore.general.weatherLocation"
                class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary-500 outline-none"
              >
                <option value="New York">New York</option>
                <option value="London">London</option>
                <option value="Tokyo">Tokyo</option>
                <option value="San Francisco">San Francisco</option>
                <option value="Sydney">Sydney</option>
                <option value="Hanoi">Hanoi</option>
              </select>
            </div>
          </section>

          <!-- Tab: Appearance -->
          <section v-if="activeTab === 'appearance'" class="space-y-6">
             <div class="space-y-3">
              <button 
                v-for="mode in ['dark', 'light', 'gray']" 
                :key="mode"
                @click="themeStore.setTheme(mode as any)"
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

          <!-- Tab: Advanced -->
          <section v-if="activeTab === 'advanced'" class="space-y-6">
            <div class="bg-white/5 rounded-xl p-4 border border-white/5 space-y-4">
              <h3 class="text-xs font-bold text-white/40 uppercase tracking-widest">Data Management</h3>
              
              <div class="grid grid-cols-2 gap-3">
                <button 
                  @click="exportSettings"
                  class="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white border border-white/10 flex items-center justify-center gap-2"
                >
                   <span>Export JSON</span>
                </button>
                <label 
                  class="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white border border-white/10 flex items-center justify-center gap-2 cursor-pointer"
                >
                   <span>Import JSON</span>
                   <input type="file" accept=".json" class="hidden" @change="importSettings" />
                </label>
              </div>
            </div>

            <div class="bg-white/5 rounded-xl p-4 border border-white/5">
              <h3 class="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">About</h3>
              <div class="text-xs text-white/60">
                <p>VibeTab v1.0.0</p>
                <p class="mt-1">Designed for flow state.</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUIStore } from '../../stores/ui.store'
import { useSettingsStore } from '../../stores/settings.store'
import { useThemeStore } from '../../stores/theme.store'
import ToggleSwitch from '../Base/ToggleSwitch.vue'

const uiStore = useUIStore()
const settingsStore = useSettingsStore()
const themeStore = useThemeStore()

const tabs = [
  { id: 'general', label: 'General' },
  { id: 'appearance', label: 'Theme' },
  { id: 'advanced', label: 'Advanced' }
]
const activeTab = ref('general')

// Export
const exportSettings = () => {
  const data = JSON.stringify(settingsStore.$state, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `vibetab-config-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// Import
const importSettings = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const config = JSON.parse(e.target?.result as string)
      // Validate and merge logic here
      Object.assign(settingsStore.$state, config)
      alert('Settings imported successfully!')
    } catch (err) {
      alert('Invalid configuration file.')
    }
  }
  reader.readAsText(file)
}
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
