/**
 * PomodoroContainer - Focus mode dashboard with timer and controls
 * Slides in from left, displays big timer, start/skip/reset buttons
 */
<script setup lang="ts">
import { usePomodoroStore } from '../../stores/pomodoro.store'
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-vue-next'

const pomodoro = usePomodoroStore()

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
        @click="pomodoro.isRunning ? pomodoro.pause() : pomodoro.start()"
        class="w-16 h-16 rounded-xl bg-primary-500/20 backdrop-blur-sm border border-primary-500/30 flex items-center justify-center text-primary-400 hover:bg-primary-500/40 hover:text-white transition-all"
      >
        <Pause v-if="pomodoro.isRunning" class="w-7 h-7" />
        <Play v-else class="w-7 h-7" />
      </button>
      
      <button
        @click="pomodoro.skip()"
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
