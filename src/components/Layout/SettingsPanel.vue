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
            <X class="w-5 h-5" />
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
          <section v-if="activeTab === 'general'" class="space-y-4">
            <!-- Clock Settings -->
            <div class="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
              <button 
                @click="expandedSection = expandedSection === 'clock' ? null : 'clock'"
                class="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
              >
                <div class="flex items-center gap-3">
                  <Clock class="w-5 h-5 text-primary-400" />
                  <span class="text-sm font-medium text-white">Clock Settings</span>
                </div>
                <ChevronDown 
                  class="w-4 h-4 text-white/50 transition-transform" 
                  :class="{ 'rotate-180': expandedSection === 'clock' }"
                />
              </button>
              <div v-if="expandedSection === 'clock'" class="p-4 border-t border-white/10 space-y-4 bg-black/20">
                <div class="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <span class="text-sm text-white/90">Show Clock</span>
                  <ToggleSwitch v-model="settingsStore.general.showClock" />
                </div>
                <div class="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5">
                  <span class="text-sm text-white/90">Time Format</span>
                  <div class="flex gap-1">
                    <button 
                      @click="clockFormat = '12h'"
                      class="px-3 py-1.5 text-xs font-medium rounded-lg border transition-all"
                      :class="clockFormat === '12h' ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/30' : 'bg-surface border-border text-text-secondary hover:bg-white/10'"
                    >12h</button>
                    <button 
                      @click="clockFormat = '24h'"
                      class="px-3 py-1.5 text-xs font-medium rounded-lg border transition-all"
                      :class="clockFormat === '24h' ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/30' : 'bg-surface border-border text-text-secondary hover:bg-white/10'"
                    >24h</button>
                  </div>
                </div>
                <div class="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5">
                  <span class="text-sm text-white/90">Date Format</span>
                  <select 
                    v-model="clockDateFormat"
                    class="bg-surface border border-border rounded-lg px-3 py-1.5 text-sm text-text-primary focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 outline-none"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="Mon Jan 01">Mon Jan 01</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    <option value="none">Hide Date</option>
                  </select>
                </div>
                <div class="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5">
                  <span class="text-sm text-white/90">Text Color</span>
                  <ColorPickerCircle v-model="clockColor" />
                </div>
                <button 
                  @click="addClockWidget"
                  class="w-full px-4 py-2.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-sm font-medium text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary-500/20"
                >
                  <Plus class="w-4 h-4" /> Add Clock Widget
                </button>
              </div>
            </div>

            <!-- Weather Settings -->
            <div class="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
              <button 
                @click="expandedSection = expandedSection === 'weather' ? null : 'weather'"
                class="w-full flex items-center justify-between p-4 text-left hover:bg-white/10 transition-all duration-200"
              >
                <div class="flex items-center gap-3">
                  <Cloud class="w-5 h-5 text-blue-400" />
                  <span class="text-sm font-medium text-white">Weather Settings</span>
                </div>
                <ChevronDown 
                  class="w-4 h-4 text-white/50 transition-transform duration-300" 
                  :class="{ 'rotate-180': expandedSection === 'weather' }"
                />
              </button>
              <Transition name="expand">
                <div v-if="expandedSection === 'weather'" class="p-4 border-t border-white/10 space-y-4 bg-black/20">
                  <div class="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <span class="text-sm text-white/90">Show Weather</span>
                    <ToggleSwitch v-model="settingsStore.general.showWeather" />
                  </div>
                  <div class="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5">
                    <span class="text-sm text-white/90">Location</span>
                    <select
                      v-model="settingsStore.general.weatherLocation"
                      class="bg-surface border border-border rounded-lg px-3 py-1.5 text-sm text-text-primary focus:border-primary-500 outline-none"
                    >
                      <option value="New York">New York</option>
                      <option value="London">London</option>
                      <option value="Tokyo">Tokyo</option>
                      <option value="San Francisco">San Francisco</option>
                      <option value="Sydney">Sydney</option>
                      <option value="Hanoi">Hanoi</option>
                    </select>
                  </div>
                  <button 
                    @click="addWeatherWidget"
                    class="w-full px-4 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-sm font-medium text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                  >
                    <Plus class="w-4 h-4" /> Add Weather Widget
                  </button>
                </div>
              </Transition>
            </div>

            <!-- Search Settings -->
            <div class="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
              <button 
                @click="expandedSection = expandedSection === 'search' ? null : 'search'"
                class="w-full flex items-center justify-between p-4 text-left hover:bg-white/10 transition-all duration-200"
              >
                <div class="flex items-center gap-3">
                  <Search class="w-5 h-5 text-green-400" />
                  <span class="text-sm font-medium text-white">Search Settings</span>
                </div>
                <ChevronDown 
                  class="w-4 h-4 text-white/50 transition-transform duration-300" 
                  :class="{ 'rotate-180': expandedSection === 'search' }"
                />
              </button>
              <Transition name="expand">
                <div v-if="expandedSection === 'search'" class="p-4 border-t border-white/10 space-y-4 bg-black/20">
                  <button 
                    @click="addSearchWidget"
                    class="w-full px-4 py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-sm font-medium text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/20"
                  >
                    <Plus class="w-4 h-4" /> Add Search Widget
                  </button>
                </div>
              </Transition>
            </div>

            <!-- Pomodoro Settings -->
            <div class="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
              <button
                @click="expandedSection = expandedSection === 'pomodoro' ? null : 'pomodoro'"
                class="w-full flex items-center justify-between p-4 text-left hover:bg-white/10 transition-all duration-200"
              >
                <div class="flex items-center gap-3">
                  <Clock class="w-5 h-5 text-rose-400" />
                  <span class="text-sm font-medium text-white">Pomodoro Settings</span>
                </div>
                <ChevronDown 
                  class="w-4 h-4 text-white/50 transition-transform duration-300" 
                  :class="{ 'rotate-180': expandedSection === 'pomodoro' }"
                />
              </button>
              <Transition name="expand">
                <div v-if="expandedSection === 'pomodoro'" class="p-4 border-t border-white/10 space-y-4 bg-black/20">
                  <div class="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5">
                    <span class="text-sm text-white/90">Focus Duration</span>
                    <div class="flex items-center gap-2">
                      <select 
                        v-model="settingsStore.general.focusDuration"
                        class="bg-surface border border-border rounded-lg px-3 py-1.5 text-sm text-text-primary focus:border-primary-500 outline-none"
                      >
                        <option v-for="t in focusTimes" :key="t" :value="t">{{ t }} min</option>
                      </select>
                      <button 
                        @click="showAddFocusTime = !showAddFocusTime"
                        class="w-7 h-7 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 flex items-center justify-center transition-colors"
                      >
                        <Plus class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div v-if="showAddFocusTime" class="flex items-center gap-2 py-2 px-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
                    <input 
                      v-model.number="newFocusTime" 
                      type="number" 
                      min="1" 
                      max="120"
                      placeholder="Minutes"
                      class="flex-1 bg-transparent border-0 text-sm text-white placeholder-white/40 outline-none"
                    />
                    <button @click="addCustomFocusTime" class="px-3 py-1 rounded bg-rose-500 text-white text-xs font-medium">Add</button>
                  </div>
                  <div class="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5">
                    <span class="text-sm text-white/90">Break Duration</span>
                    <div class="flex items-center gap-2">
                      <select 
                        v-model="settingsStore.general.breakDuration"
                        class="bg-surface border border-border rounded-lg px-3 py-1.5 text-sm text-text-primary focus:border-primary-500 outline-none"
                      >
                        <option v-for="t in breakTimes" :key="t" :value="t">{{ t }} min</option>
                      </select>
                      <button 
                        @click="showAddBreakTime = !showAddBreakTime"
                        class="w-7 h-7 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 flex items-center justify-center transition-colors"
                      >
                        <Plus class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div v-if="showAddBreakTime" class="flex items-center gap-2 py-2 px-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <input 
                      v-model.number="newBreakTime" 
                      type="number" 
                      min="1" 
                      max="60"
                      placeholder="Minutes"
                      class="flex-1 bg-transparent border-0 text-sm text-white placeholder-white/40 outline-none"
                    />
                    <button @click="addCustomBreakTime" class="px-3 py-1 rounded bg-green-500 text-white text-xs font-medium">Add</button>
                  </div>
                  <div class="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <span class="text-sm text-white/90">Auto-dim when timer starts</span>
                    <ToggleSwitch v-model="settingsStore.general.pomodoroDim" />
                  </div>
                  <div class="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <span class="text-sm text-white/90">Sound notifications</span>
                    <ToggleSwitch v-model="settingsStore.general.pomodoroSound" />
                  </div>
                </div>
              </Transition>
            </div>

            <!-- Auto-Hide Settings -->
            <div class="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
              <button
                @click="expandedSection = expandedSection === 'autohide' ? null : 'autohide'"
                class="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
              >
                <div class="flex items-center gap-3">
                  <Eye class="w-5 h-5 text-violet-400" />
                  <span class="text-sm font-medium text-white">Auto-Hide Widgets</span>
                </div>
                <ChevronDown 
                  class="w-4 h-4 text-white/50 transition-transform" 
                  :class="{ 'rotate-180': expandedSection === 'autohide' }"
                />
              </button>
              <div v-if="expandedSection === 'autohide'" class="p-4 border-t border-white/10 space-y-4 bg-black/20">
                <div class="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <span class="text-sm text-white/90">Enable Auto-Hide</span>
                  <ToggleSwitch v-model="settingsStore.autoHide.enabled" />
                </div>
                <div class="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5">
                  <span class="text-sm text-white/90">Timeout</span>
                  <select 
                    v-model="settingsStore.autoHide.timeout"
                    class="bg-surface border border-border rounded-lg px-3 py-1.5 text-sm text-text-primary focus:border-primary-500 outline-none"
                  >
                    <option :value="30">30s</option>
                    <option :value="60">60s</option>
                    <option :value="120">2 min</option>
                    <option :value="300">5 min</option>
                  </select>
                </div>
                <div class="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <span class="text-sm text-white/90">Keep clock visible</span>
                  <ToggleSwitch v-model="settingsStore.autoHide.keepClockVisible" />
                </div>
                <div class="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <span class="text-sm text-white/90">Dim background</span>
                  <ToggleSwitch v-model="settingsStore.autoHide.dimBackground" />
                </div>
                <div v-if="settingsStore.autoHide.dimBackground" class="space-y-3 pt-2 pl-2 border-l-2 border-violet-500/30">
                  <div class="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5">
                    <span class="text-sm text-white/90">Dim color</span>
                    <ColorPickerCircle v-model="settingsStore.autoHide.dimColor" />
                  </div>
                  <div class="py-2 px-3 rounded-lg bg-white/5">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm text-white/90">Opacity</span>
                      <span class="text-xs text-white/60 font-mono">{{ Math.round(settingsStore.autoHide.dimOpacity * 100) }}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.1" 
                      max="0.9" 
                      step="0.1"
                      v-model.number="settingsStore.autoHide.dimOpacity"
                      class="w-full h-2 rounded-full appearance-none cursor-pointer bg-white/10 accent-violet-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Show Greeting -->
            <div class="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
              <span class="text-sm text-white/80">Show Greeting</span>
              <ToggleSwitch v-model="settingsStore.general.showGreeting" />
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
                <Image class="w-8 h-8 text-white/40 mb-2" />
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
                <AlertTriangle class="w-4 h-4" />
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
                    <X class="w-3 h-3" />
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

            <!-- Background Blur Setting -->
            <div class="bg-white/5 rounded-xl p-4 border border-white/5 space-y-3 mt-4">
              <h3 class="text-xs font-bold text-white/40 uppercase tracking-widest">Background Blur</h3>
              <div class="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  v-model.number="backgroundStore.state.blur"
                  class="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary-500"
                />
                <span class="text-sm text-white/60 w-12 text-right">{{ backgroundStore.state.blur }}px</span>
              </div>
            </div>
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
                <AlertTriangle class="w-3 h-3 inline mr-1" /> Clear All Data
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
import { useStorage } from '../../composables/useStorage'
import { useUIStore } from '../../stores/ui.store'
import { useSettingsStore } from '../../stores/settings.store'
import { useThemeStore } from '../../stores/theme.store'
import { useBackgroundStore } from '../../stores/background.store'
import { BackgroundService } from '../../services/BackgroundService'
import ToggleSwitch from '../Base/ToggleSwitch.vue'
import ColorPickerCircle from '../Base/ColorPickerCircle.vue'
import { X, Image, AlertTriangle, Clock, Cloud, Search, ChevronDown, Plus, Eye } from 'lucide-vue-next'

import { useGridStore } from '../../stores/grid.store'
import { getClockSize, getSearchSize } from '../../constants/widgetSizes'

const uiStore = useUIStore()
const settingsStore = useSettingsStore()
const gridStore = useGridStore()
const themeStore = useThemeStore()
const backgroundStore = useBackgroundStore()

const tabs = [
  { id: 'general', label: 'General' },
  { id: 'appearance', label: 'Theme' },
  { id: 'backgrounds', label: 'Background' },
  { id: 'advanced', label: 'Advanced' }
]
const activeTab = ref('general')
const expandedSection = ref<string | null>(null)

const clockFormat = ref<'12h' | '24h'>('24h')
const clockDateFormat = ref<'MM/DD/YYYY' | 'DD/MM/YYYY' | 'Mon Jan 01' | 'YYYY-MM-DD' | 'none'>('Mon Jan 01')
const clockColor = ref('#ffffff')

const customFocusTimes = useStorage('vibetab_custom_focus_times', [15, 25, 30, 45, 60])
const customBreakTimes = useStorage('vibetab_custom_break_times', [5, 10, 15])
const focusTimes = computed(() => [...new Set(customFocusTimes.value)].sort((a, b) => a - b))
const breakTimes = computed(() => [...new Set(customBreakTimes.value)].sort((a, b) => a - b))

const showAddFocusTime = ref(false)
const showAddBreakTime = ref(false)
const newFocusTime = ref(0)
const newBreakTime = ref(0)

const addCustomFocusTime = () => {
  if (newFocusTime.value > 0 && newFocusTime.value <= 120) {
    customFocusTimes.value = [...customFocusTimes.value, newFocusTime.value]
    settingsStore.general.focusDuration = newFocusTime.value
    newFocusTime.value = 0
    showAddFocusTime.value = false
  }
}

const addCustomBreakTime = () => {
  if (newBreakTime.value > 0 && newBreakTime.value <= 60) {
    customBreakTimes.value = [...customBreakTimes.value, newBreakTime.value]
    settingsStore.general.breakDuration = newBreakTime.value
    newBreakTime.value = 0
    showAddBreakTime.value = false
  }
}

const addClockWidget = () => {
  const clockSize = getClockSize('medium')
  gridStore.addWidget({
    id: `clock-${Date.now()}`,
    type: 'clock',
    x: 0, y: 0,
    w: clockSize.w,
    h: clockSize.h,
    config: { 
      style: 'digital', 
      format: clockFormat.value, 
      dateFormat: clockDateFormat.value, 
      showSeconds: false,
      color: clockColor.value
    },
    isLocked: false,
    zIndex: 10,
    createdAt: Date.now(),
    updatedAt: Date.now()
  })
}

const addWeatherWidget = () => {
  gridStore.addWidget({
    id: `weather-${Date.now()}`,
    type: 'weather',
    x: 0, y: 0,
    w: 3, h: 2,
    config: { unit: 'c', location: settingsStore.general.weatherLocation },
    isLocked: false,
    zIndex: 10,
    createdAt: Date.now(),
    updatedAt: Date.now()
  })
}

const addSearchWidget = () => {
  const searchSize = getSearchSize('standard')
  gridStore.addWidget({
    id: `search-${Date.now()}`,
    type: 'search',
    x: 0, y: 0,
    w: searchSize.w,
    h: searchSize.h,
    config: { provider: 'google', aiMode: false },
    isLocked: false,
    zIndex: 10,
    createdAt: Date.now(),
    updatedAt: Date.now()
  })
}

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

.expand-enter-active {
  transition: all 0.3s ease-out;
  overflow: hidden;
}
.expand-leave-active {
  transition: all 0.2s ease-in;
  overflow: hidden;
}
.expand-enter-from, .expand-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}
.expand-enter-to, .expand-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>
