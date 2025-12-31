<template>
  <div class="fixed inset-0 z-50 overflow-hidden pointer-events-none">
    <transition name="fade">
      <div
        v-if="uiStore.isSettingsOpen"
        @click="uiStore.closeSettings"
        class="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
      ></div>
    </transition>

    <transition name="slide-right">
      <div
        v-if="uiStore.isSettingsOpen"
        class="absolute right-0 top-0 h-full w-[400px] bg-surface-dark border-l border-white/10 shadow-2xl pointer-events-auto flex flex-col"
      >
        <div class="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 class="text-xl font-bold text-white">Settings</h2>
          <button
            @click="uiStore.closeSettings"
            class="p-2 text-white/50 hover:text-white transition-colors"
          >
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>

        <div class="flex border-b border-white/5 px-6">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="px-4 py-3 text-sm font-medium border-b-2 transition-colors"
            :class="activeTab === tab.id ? 'border-primary-500 text-white' : 'border-transparent text-white/50 hover:text-white/80'"
            :data-testid="`settings-tab-${tab.id}`"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-8">
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

          <section v-if="activeTab === 'backgrounds'" class="space-y-6">
            <div class="bg-white/5 rounded-xl p-4 border border-white/5 space-y-4">
              <h3 class="text-xs font-bold text-white/40 uppercase tracking-widest">Add Background</h3>

              <div
                @drop.prevent="handleDrop"
                @dragover.prevent="isDragging = true"
                @dragleave="isDragging = false"
                class="w-full h-32 rounded-lg border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer"
                :class="isDragging ? 'border-primary-500 bg-primary-500/10' : 'border-white/10 hover:border-primary-500/50 hover:bg-white/5'"
                @click="fileInput?.click()"
              >
                <PhotoIcon class="w-8 h-8 text-white/40 mb-2" />
                <span class="text-xs text-white/60">Drag & drop or click to upload</span>
                <span class="text-[10px] text-white/30 mt-1">PNG, JPG, WebP, GIF, MP4, WebM</span>
              </div>
              <input
                ref="fileInput"
                type="file"
                :accept="acceptedTypes"
                class="hidden"
                @change="handleFileSelect"
              />

              <div class="flex gap-2">
                <input
                  v-model="urlInput"
                  type="text"
                  placeholder="Or paste image/video URL..."
                  class="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:border-primary-500 outline-none"
                  data-testid="background-url-input"
                />
                <button
                  @click="handleUrlAdd"
                  :disabled="!urlInput.trim()"
                  class="px-3 py-2 rounded-lg bg-primary-500 text-xs text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-600 transition-colors"
                  data-testid="add-background-btn"
                >
                  Add
                </button>
              </div>

              <div v-if="uploadError" class="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">
                <ExclamationTriangleIcon class="w-4 h-4" />
                <span>{{ uploadError }}</span>
              </div>

              <div v-if="previewUrl" class="space-y-2">
                <div class="relative rounded-lg overflow-hidden aspect-video bg-black/20">
                  <video
                    v-if="previewType === 'video'"
                    :src="previewUrl"
                    autoplay muted loop playsinline
                    class="w-full h-full object-cover"
                  ></video>
                  <img
                    v-else
                    :src="previewUrl"
                    class="w-full h-full object-cover"
                    alt="Preview"
                  />
                </div>
                <div class="flex gap-2">
                  <button
                    @click="confirmPreview"
                    class="flex-1 px-3 py-2 rounded-lg bg-primary-500 text-xs text-white hover:bg-primary-600"
                  >
                    Confirm
                  </button>
                  <button
                    @click="cancelPreview"
                    class="px-3 py-2 rounded-lg bg-white/5 text-xs text-white/60 hover:bg-white/10"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            <div v-if="backgroundStore.state.backgrounds.length" class="space-y-3">
              <h3 class="text-xs font-bold text-white/40 uppercase tracking-widest">Saved Backgrounds</h3>
              <div class="grid grid-cols-3 gap-2">
                <div
                  v-for="bg in backgroundStore.state.backgrounds"
                  :key="bg.id"
                  @click="backgroundStore.setBackground(bg.id)"
                  class="relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all group"
                  :class="backgroundStore.state.currentBackgroundId === bg.id ? 'border-primary-500' : 'border-transparent hover:border-white/20'"
                >
                  <video
                    v-if="bg.type === 'video'"
                    :src="bg.source"
                    muted loop
                    class="w-full h-full object-cover"
                  ></video>
                  <img
                    v-else
                    :src="bg.source"
                    class="w-full h-full object-cover"
                    :alt="bg.name"
                  />
                  <button
                    @click.stop="backgroundStore.removeBackground(bg.id)"
                    class="absolute top-1 right-1 p-1 rounded bg-black/50 text-white/80 opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all"
                  >
                    <XMarkIcon class="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            <button
              @click="clearBackground"
              class="w-full px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs text-red-400 border border-red-500/20"
            >
              Reset to Default Background
            </button>
          </section>

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

              <button
                @click="clearAllData"
                class="w-full px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs text-red-400 border border-red-500/20 mt-2"
              >
                <ExclamationTriangleIcon class="w-3 h-3 inline mr-1" /> Clear All Data
              </button>
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
import { ref, computed } from 'vue'
import { useUIStore } from '../../stores/ui.store'
import { useSettingsStore } from '../../stores/settings.store'
import { useThemeStore } from '../../stores/theme.store'
import { useBackgroundStore } from '../../stores/background.store'
import { BackgroundService } from '../../services/BackgroundService'
import ToggleSwitch from '../Base/ToggleSwitch.vue'
import { XMarkIcon, PhotoIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

const uiStore = useUIStore()
const settingsStore = useSettingsStore()
const themeStore = useThemeStore()
const backgroundStore = useBackgroundStore()

const tabs = [
  { id: 'general', label: 'General' },
  { id: 'appearance', label: 'Theme' },
  { id: 'backgrounds', label: 'Background' },
  { id: 'advanced', label: 'Advanced' }
]
const activeTab = ref('general')

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const urlInput = ref('')
const uploadError = ref('')
const previewUrl = ref('')
const previewType = ref<'image' | 'video'>('image')
const pendingFile = ref<File | null>(null)

const acceptedTypes = computed(() => BackgroundService.getAcceptedFileTypes())

const handleDrop = async (e: DragEvent) => {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file) await processFile(file)
}

const handleFileSelect = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) await processFile(file)
}

const processFile = async (file: File) => {
  uploadError.value = ''
  const validation = BackgroundService.validateFile(file)

  if (!validation.isValid) {
    uploadError.value = validation.error || 'Invalid file'
    return
  }

  pendingFile.value = file
  previewUrl.value = URL.createObjectURL(file)
  previewType.value = validation.type === 'video' ? 'video' : 'image'
}

const handleUrlAdd = async () => {
  uploadError.value = ''
  const url = urlInput.value.trim()
  if (!url) return

  const validation = BackgroundService.validateUrl(url)
  if (!validation.isValid) {
    uploadError.value = validation.error || 'Invalid URL'
    return
  }

  const result = await backgroundStore.addBackgroundFromUrl(url)
  if (result.success) {
    urlInput.value = ''
    const newBg = backgroundStore.state.backgrounds[backgroundStore.state.backgrounds.length - 1]
    if (newBg) {
      backgroundStore.state.currentBackgroundId = newBg.id
    }
  } else {
    uploadError.value = result.error || 'Failed to add background'
  }
}

const confirmPreview = async () => {
  if (pendingFile.value) {
    const result = await backgroundStore.setBackground(pendingFile.value)
    if (!result.success) {
      uploadError.value = result.error || 'Failed to save background'
    }
  }
  cancelPreview()
}

const cancelPreview = () => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  previewUrl.value = ''
  pendingFile.value = null
}

const clearBackground = () => {
  backgroundStore.resetBackground()
}

const clearAllData = () => {
  if (confirm('Are you sure? This will reset all widgets, settings, and backgrounds. This action cannot be undone.')) {
    localStorage.clear()
    window.location.reload()
  }
}

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

const importSettings = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const config = JSON.parse(e.target?.result as string)
      Object.assign(settingsStore.$state, config)
      alert('Settings imported successfully!')
    } catch {
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
