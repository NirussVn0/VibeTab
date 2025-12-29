import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useStorage } from '../composables/useStorage'
import type { Background, BackgroundState } from '../types/background'

export const useBackgroundStore = defineStore('background', () => {
  const backgrounds = useStorage<Background[]>('vibetab_backgrounds', [])
  
  const state = useStorage<BackgroundState>('vibetab_background_state', {
    backgrounds: [],
    currentBackgroundId: null,
    rotationMode: 'random',
    rotationInterval: 60,
    rotationEnabled: false,
    blur: 0,
    brightness: 100
  })

  // Default gradients if no background set
  const defaultGradient = 'linear-gradient(135deg, #218085 0%, #1a6872 100%)' // Teal theme gradient

  const currentBackground = computed(() => {
    if (!state.value.currentBackgroundId) return null
    return backgrounds.value.find(b => b.id === state.value.currentBackgroundId) || null
  })

  return {
    state,
    backgrounds,
    currentBackground,
    defaultGradient
  }
})
