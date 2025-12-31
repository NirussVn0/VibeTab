import { defineStore } from 'pinia'
import { useStorage } from '../composables/useStorage'

export const useSettingsStore = defineStore('settings', () => {
  // Persist general settings
  const { state: general } = useStorage('vibetab_settings_general', {
    showClock: true,
    showWeather: true,
    showGreeting: true,
    weatherLocation: 'New York'
  })

  return {
    general
  }
})
