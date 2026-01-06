<!-- PomodoroContainer.vue - Focus mode dashboard with draggable/resizable layout -->
<script setup lang="ts">
import { computed } from 'vue'
import { usePomodoroStore } from '../../stores/pomodoro.store'
import { useUIStore } from '../../stores/ui.store'
import { useSettingsStore } from '../../stores/settings.store'
import { usePomodoroLayoutStore } from '../../stores/pomodoroLayout.store'
import { useSound } from '../../composables/useSound'
import { Play, Pause, SkipForward, RotateCcw, Settings, GripVertical } from 'lucide-vue-next'
import { GridLayout, GridItem } from 'vue-grid-layout-v3'

const pomodoro = usePomodoroStore()
const uiStore = useUIStore()
const settingsStore = useSettingsStore()
const layoutStore = usePomodoroLayoutStore()
const { playStart, playPause, playComplete } = useSound()

const isEditMode = computed(() => uiStore.isEditMode)

const clockItem = computed(() => layoutStore.layout.find(item => item.i === 'clock') || layoutStore.layout[0])
const controlsItem = computed(() => layoutStore.layout.find(item => item.i === 'controls') || layoutStore.layout[1])

const modeLabels = { 
  focus: 'Focus Time', 
  shortBreak: 'Short Break', 
  longBreak: 'Long Break',
  prepare: 'Prepare'
}
const modeColors = { 
  focus: 'text-primary-400', 
  shortBreak: 'text-green-400', 
  longBreak: 'text-blue-400',
  prepare: 'text-purple-400'
}

const focusTimes = [15, 25, 30, 45, 60]
const breakTimes = [5, 10, 15]

const handlePlayPause = () => {
  if (pomodoro.isRunning) { pomodoro.pause(); playPause() }
  else { pomodoro.start(); playStart() }
}

const handleSkip = () => { playComplete(); pomodoro.skip() }
</script>

<template>
  <div class="w-full h-full relative p-8">
    <!-- Edit Mode Indicator -->
    <div v-if="isEditMode" class="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-primary-500/20 border border-primary-500/30 text-primary-400 text-sm flex items-center gap-2 z-50">
      <Settings class="w-4 h-4" />
      <span>Edit Mode - Drag and resize elements</span>
    </div>

    <GridLayout
      v-model:layout="layoutStore.layout"
      :col-num="24"
      :row-height="16"
      :is-draggable="isEditMode"
      :is-resizable="isEditMode"
      :vertical-compact="false"
      :prevent-collision="true"
      :use-css-transforms="true"
      :margin="[0, 0]"
      :container-padding="[16, 16]"
    >
      <!-- Clock Display -->
      <GridItem
        :i="clockItem.i"
        :x="clockItem.x"
        :y="clockItem.y"
        :w="clockItem.w"
        :h="clockItem.h"
        :min-w="clockItem.minW"
        :min-h="clockItem.minH"
        class="flex flex-col items-center justify-center"
      >
        <div class="w-full h-full flex flex-col items-center justify-center gap-4 p-6 rounded-xl backdrop-blur-sm"
          :class="isEditMode ? 'bg-white/5 border-2 border-dashed border-primary-500/50 cursor-move' : ''"
        >
          <div v-if="isEditMode" class="absolute top-2 right-2 text-primary-400 opacity-50">
            <GripVertical class="w-5 h-5" />
          </div>
          <div class="text-center">
            <p class="text-sm uppercase tracking-widest mb-2" :class="modeColors[pomodoro.mode]">
              {{ modeLabels[pomodoro.mode] }}
            </p>
            <div class="text-[6rem] md:text-[8rem] font-bold tabular-nums leading-none tracking-tight text-white" style="font-family: system-ui, -apple-system, sans-serif;">
              {{ pomodoro.formattedTime }}
            </div>
          </div>

          <!-- Timer Duration Settings (Edit Mode Only) -->
          <div v-if="isEditMode" class="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm mt-4">
            <div class="text-center">
              <p class="text-xs text-white/50 mb-2">Focus</p>
              <div class="flex gap-1">
                <button 
                  v-for="t in focusTimes" :key="'f'+t"
                  @click="settingsStore.general.focusDuration = t"
                  class="px-2 py-1 text-xs rounded-lg transition-all"
                  :class="settingsStore.general.focusDuration === t ? 'bg-primary-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'"
                >{{ t }}m</button>
              </div>
            </div>
            <div class="w-px bg-white/10"></div>
            <div class="text-center">
              <p class="text-xs text-white/50 mb-2">Break</p>
              <div class="flex gap-1">
                <button 
                  v-for="t in breakTimes" :key="'b'+t"
                  @click="settingsStore.general.breakDuration = t"
                  class="px-2 py-1 text-xs rounded-lg transition-all"
                  :class="settingsStore.general.breakDuration === t ? 'bg-green-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'"
                >{{ t }}m</button>
              </div>
            </div>
          </div>
        </div>
      </GridItem>

      <!-- Control Buttons -->
      <GridItem
        :i="controlsItem.i"
        :x="controlsItem.x"
        :y="controlsItem.y"
        :w="controlsItem.w"
        :h="controlsItem.h"
        :min-w="controlsItem.minW"
        :min-h="controlsItem.minH"
      >
        <div class="w-full h-full flex flex-col items-center justify-center gap-4 p-4 rounded-xl backdrop-blur-sm"
          :class="isEditMode ? 'bg-white/5 border-2 border-dashed border-primary-500/50 cursor-move' : ''"
        >
          <div v-if="isEditMode" class="absolute top-2 right-2 text-primary-400 opacity-50">
            <GripVertical class="w-5 h-5" />
          </div>
          
          <div class="flex gap-4">
            <button
              @click="handlePlayPause"
              class="w-16 h-16 rounded-xl bg-primary-500/20 backdrop-blur-sm border border-primary-500/30 flex items-center justify-center text-primary-400 hover:bg-primary-500/40 hover:text-white transition-all"
            >
              <Pause v-if="pomodoro.isRunning" class="w-7 h-7" />
              <Play v-else class="w-7 h-7" />
            </button>
            
            <button
              @click="handleSkip"
              class="w-16 h-16 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-all"
            >
              <SkipForward class="w-7 h-7" />
            </button>
            
            <button
              @click="pomodoro.reset()"
              class="w-16 h-16 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-all"
            >
              <RotateCcw class="w-7 h-7" />
            </button>
          </div>

          <!-- Cycle Progress -->
          <div class="flex gap-2">
            <div 
              v-for="i in 4" :key="i"
              class="w-3 h-3 rounded-full transition-colors"
              :class="i <= pomodoro.cycles % 4 ? 'bg-primary-500' : 'bg-white/20'"
            />
          </div>
        </div>
      </GridItem>
    </GridLayout>
  </div>
</template>

<style>
.vue-grid-item {
  transition: all 200ms ease;
  transition-property: left, top, width, height;
}

.vue-grid-item.vue-grid-placeholder {
  background: rgba(59, 130, 246, 0.15);
  opacity: 0.2;
  transition-duration: 100ms;
  z-index: 2;
  border-radius: 12px;
  border: 2px dashed rgba(59, 130, 246, 0.5);
}

.vue-grid-item > .vue-resizable-handle {
  position: absolute;
  width: 20px;
  height: 20px;
  bottom: 0;
  right: 0;
  background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0gMjAgMCBMIDAgMjAgTCAyMCAyMCBaIiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMykiLz48L3N2Zz4=");
  background-position: bottom right;
  padding: 0 3px 3px 0;
  background-repeat: no-repeat;
  background-origin: content-box;
  box-sizing: border-box;
  cursor: se-resize;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.vue-grid-item:hover > .vue-resizable-handle {
  opacity: 1;
}
</style>
