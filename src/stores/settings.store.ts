import { defineStore } from 'pinia'
import { useStorage } from '../composables/useStorage'

export const useSettingsStore = defineStore('settings', () => {
  const general = useStorage('vibetab_settings_general', {
    showClock: true,
    showWeather: true,
    showGreeting: true,
    weatherLocation: 'New York',
    focusDuration: 25,
    breakDuration: 5,
    pomodoroDim: true,
    pomodoroSound: true
  })

  const autoHide = useStorage('vibetab_settings_autohide', {
    enabled: false,
    timeout: 60,
    keepClockVisible: true,
    dimBackground: true,
    dimColor: '#000000',
    dimOpacity: 0.6
  })

  return {
    general,
    autoHide
  }
})

