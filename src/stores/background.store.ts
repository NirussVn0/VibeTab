import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type BackgroundType = 'image' | 'video' | 'color'

export interface BackgroundConfig {
  type: BackgroundType
  src: string
  overlayOpacity: number
  blur: number
}

export const useBackgroundStore = defineStore('background', () => {
  const config = ref<BackgroundConfig>({
    type: 'video', // Default to video for "wow" factor
    src: '/backgrounds/default-dynamic.mp4', 
    overlayOpacity: 0.2,
    blur: 0
  })

  const setBackground = (newConfig: Partial<BackgroundConfig>) => {
    config.value = { ...config.value, ...newConfig }
  }

  const backgroundStyle = computed(() => {
    return {
      filter: `blur(${config.value.blur}px)`
    }
  })

  const overlayStyle = computed(() => {
    return {
      backgroundColor: `rgba(0,0,0,${config.value.overlayOpacity})`
    }
  })

  return {
    config,
    setBackground,
    backgroundStyle,
    overlayStyle
  }
})
