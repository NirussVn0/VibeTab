/**
 * usePomodoroStore - State for Pomodoro mode and timer logic
 * Persists view mode and session state across tab refreshes
 */
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useStorage } from '../composables/useStorage'
import { useSettingsStore } from './settings.store'

export const usePomodoroStore = defineStore('pomodoro', () => {
  const settingsStore = useSettingsStore()
  
  const persistedState = useStorage('vibetab_pomodoro_state', {
    isPomodoroView: false,
    mode: 'focus' as 'focus' | 'shortBreak' | 'longBreak',
    cycles: 0
  })
  
  const isActive = ref(false)
  const isPomodoroView = ref(persistedState.value.isPomodoroView)
  const mode = ref<'focus' | 'shortBreak' | 'longBreak'>(persistedState.value.mode)
  const cycles = ref(persistedState.value.cycles)
  const isRunning = ref(false)
  
  const getDurations = () => ({
    focus: (settingsStore.general.focusDuration || 25) * 60,
    shortBreak: (settingsStore.general.breakDuration || 5) * 60,
    longBreak: 15 * 60
  })
  
  const timeLeft = ref(getDurations().focus)
  let timerId: ReturnType<typeof setInterval> | null = null
  
  watch([isPomodoroView, mode, cycles], () => {
    persistedState.value = {
      isPomodoroView: isPomodoroView.value,
      mode: mode.value,
      cycles: cycles.value
    }
  })
  
  const formattedTime = computed(() => {
    const mins = Math.floor(timeLeft.value / 60)
    const secs = timeLeft.value % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  })
  
  const toggleView = () => {
    isPomodoroView.value = !isPomodoroView.value
  }
  
  const enterPomodoroView = () => {
    isPomodoroView.value = true
  }
  
  const exitPomodoroView = () => {
    isPomodoroView.value = false
  }
  
  const start = () => {
    if (isRunning.value) return
    isRunning.value = true
    isActive.value = true
    timerId = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
      } else {
        skip()
      }
    }, 1000)
  }
  
  const pause = () => {
    isRunning.value = false
    if (timerId) clearInterval(timerId)
  }
  
  const reset = () => {
    pause()
    timeLeft.value = getDurations()[mode.value]
  }
  
  const skip = () => {
    pause()
    if (mode.value === 'focus') {
      cycles.value++
      mode.value = cycles.value % 4 === 0 ? 'longBreak' : 'shortBreak'
    } else {
      mode.value = 'focus'
    }
    timeLeft.value = getDurations()[mode.value]
  }
  
  return {
    isPomodoroView,
    isActive,
    mode,
    timeLeft,
    isRunning,
    cycles,
    formattedTime,
    toggleView,
    enterPomodoroView,
    exitPomodoroView,
    start,
    pause,
    reset,
    skip
  }
})

