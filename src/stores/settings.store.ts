import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // Placeholder for general settings
  const general = ref({
    showClock: true,
    showWeather: true,
    showGreeting: true
  })

  return {
    general
  }
})
