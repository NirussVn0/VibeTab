<!-- PomodoroContainer.vue - Focus mode dashboard with unified edit layout --  >
<script setup lang="ts">
import { computed } from 'vue'
import { usePomodoroStore } from '../../stores/pomodoro.store'
import { useUIStore } from '../../stores/ui.store'
import { useSettingsStore } from '../../stores/settings.store'
import { usePomodoroLayoutStore } from '../../stores/pomodoroLayout.store'
import { useSound } from '../../composables/useSound'
import { Play, Pause, SkipForward, RotateCcw, Settings, GripVertical } from 'lucide-vue-next'
import EditableGridLayout from '../Layout/EditableGridLayout.vue'

const pomodoro = usePomodoroStore()
const uiStore = useUIStore()
const settingsStore = useSettingsStore()
const layoutStore = usePomodoroLayoutStore()
const { playStart, playPause, playComplete } = useSound()

const isEditMode = computed(() => uiStore.isEditMode)

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
    <div v-if="isEditMode" class="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-primary-500/20 border border-primary-500/30 text-primary-400 text-sm flex items-center gap-2 z-50">
      <Settings class="w-4 h-4" />
      <span>Edit Mode - Drag and resize elements</span>
    </div>

    <EditableGridLayout
      v-model:layout="layoutStore.layout"
      :is-edit-mode="isEditMode"
    >
      <template #default="{ item }">
        <div v-if="item.i === 'clock'" class="w-full h-full flex flex-col items-center justify-center gap-4 p-6 rounded-xl backdrop-blur-sm"
          :class="isEditMode ? 'bg-white/5 border-2 border-dashed border-primary-500/50 cursor-move' : ''">
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

        <div v-else-if="item.i === 'controls'" class="w-full h-full flex flex-col items-center justify-center gap-4 p-4 rounded-xl backdrop-blur-sm"
          :class="isEditMode ? 'bg-white/5 border-2 border-dashed border-primary-500/50 cursor-move' : ''">
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

          <div class="flex gap-2">
            <div 
              v-for="i in 4" :key="i"
              class="w-3 h-3 rounded-full transition-colors"
              :class="i <= pomodoro.cycles % 4 ? 'bg-primary-500' : 'bg-white/20'"
            />
          </div>
        </div>
      </template>
    </EditableGridLayout>
  </div>
</template>
