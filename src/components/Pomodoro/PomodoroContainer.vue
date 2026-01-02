/**
 * PomodoroContainer - Focus mode dashboard with timer and controls
 * TopToolbar handles edit mode and settings globally
 */
<script setup lang="ts">
import { usePomodoroStore } from '../../stores/pomodoro.store'
import { useSound } from '../../composables/useSound'
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-vue-next'

const pomodoro = usePomodoroStore()
const { playStart, playPause, playComplete } = useSound()

const modeLabels = {
  focus: 'Focus Time',
  shortBreak: 'Short Break',
  longBreak: 'Long Break'
}

const modeColors = {
  focus: 'text-primary-400',
  shortBreak: 'text-green-400',
  longBreak: 'text-blue-400'
}

const handlePlayPause = () => {
  if (pomodoro.isRunning) {
    pomodoro.pause()
    playPause()
  } else {
    pomodoro.start()
    playStart()
  }
}

const handleSkip = () => {
  playComplete()
  pomodoro.skip()
}
</script>

<template>
  <div class="w-full h-full flex flex-col items-center justify-center gap-8 p-8">
    <div class="text-center">
      <p class="text-sm uppercase tracking-widest mb-2" :class="modeColors[pomodoro.mode]">
        {{ modeLabels[pomodoro.mode] }}
      </p>
      <div 
        class="text-[8rem] font-bold tabular-nums leading-none tracking-tight text-white"
        style="font-family: system-ui, -apple-system, sans-serif;"
      >
        {{ pomodoro.formattedTime }}
      </div>
    </div>

    <div class="flex gap-4">
      <button
        @click="handlePlayPause"
        class="w-16 h-16 rounded-xl bg-primary-500/20 backdrop-blur-sm border border-primary-500/30 flex items-center justify-center text-primary-400 hover:bg-primary-500/40 hover:text-white transition-all interactive"
      >
        <Pause v-if="pomodoro.isRunning" class="w-7 h-7" />
        <Play v-else class="w-7 h-7" />
      </button>
      
      <button
        @click="handleSkip"
        class="w-16 h-16 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-all interactive"
      >
        <SkipForward class="w-7 h-7" />
      </button>
      
      <button
        @click="pomodoro.reset()"
        class="w-16 h-16 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-all interactive"
      >
        <RotateCcw class="w-7 h-7" />
      </button>
    </div>

    <div class="flex gap-2 mt-4">
      <div 
        v-for="i in 4" 
        :key="i"
        class="w-3 h-3 rounded-full transition-colors"
        :class="i <= pomodoro.cycles % 4 ? 'bg-primary-500' : 'bg-white/20'"
      />
    </div>
  </div>
</template>
