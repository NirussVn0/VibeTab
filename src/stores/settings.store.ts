import { defineStore } from 'pinia'
import { useStorage } from '../composables/useStorage'

export const useSettingsStore = defineStore('settings', () => {
  // Persist general settings
  const general = useStorage('vibetab_settings_general', {
    showClock: true,
    showWeather: true,
    showGreeting: true,
    weatherLocation: 'New York',
    enableSleepMode: true,
    focusDuration: 25,
    breakDuration: 5,
    pomodoroDim: true
  })

  return {
    general
  }
})
