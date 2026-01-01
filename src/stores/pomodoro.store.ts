/**
 * usePomodoroStore - State for Pomodoro mode and timer logic
 * Controls focus/break cycles, timer countdown, and view toggling
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePomodoroStore = defineStore('pomodoro', () => {
  const isActive = ref(false)
  const isPomodoroView = ref(false)
  
  const mode = ref<'focus' | 'shortBreak' | 'longBreak'>('focus')
  const timeLeft = ref(25 * 60)
  const isRunning = ref(false)
  const cycles = ref(0)
  
  const durations = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  }
  
  let timerId: ReturnType<typeof setInterval> | null = null
  
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
    timeLeft.value = durations[mode.value]
  }
  
  const skip = () => {
    pause()
    if (mode.value === 'focus') {
      cycles.value++
      mode.value = cycles.value % 4 === 0 ? 'longBreak' : 'shortBreak'
    } else {
      mode.value = 'focus'
    }
    timeLeft.value = durations[mode.value]
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
