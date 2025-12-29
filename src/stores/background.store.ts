import { defineStore } from 'pinia'
import { computed, watch } from 'vue'
import { useStorage } from '../composables/useStorage'
import { mediaDB } from '../utils/indexedDB'
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

  // --- Actions ---
  const loadBackgrounds = async () => {
    // Load metadata from LocalStorage (already done by useStorage)
    // Validate if Blobs exist in IndexedDB (lazy load when needed)
  }

  const addBackground = async (file: File) => {
    const id = crypto.randomUUID()
    const type = file.type.startsWith('video') ? 'video' : 'image'
    const blob = new Blob([file], { type: file.type })

    // Save to IndexedDB
    await mediaDB.save(id, blob)

    // Save metadata to Store (LocalStorage)
    // We create a "Blob URL" temporarily for display, but real source is DB
    state.value.backgrounds.push({
      id,
      name: file.name,
      type: type as 'image' | 'video',
      source: URL.createObjectURL(blob), // ephemeral URL
      addedAt: Date.now(),
      position: 'cover',
      isDefault: false,
      createdAt: Date.now()
    })
  }

  const removeBackground = async (id: string) => {
    await mediaDB.delete(id)
    state.value.backgrounds = state.value.backgrounds.filter(b => b.id !== id)
    if (state.value.currentBackgroundId === id) {
      state.value.currentBackgroundId = null
    }
  }

  const setBackground = (id: string) => {
    state.value.currentBackgroundId = id
  }

  // --- Rotation Logic ---
  let rotationTimer:  ReturnType<typeof setInterval> | null = null

  const startRotation = () => {
    if (rotationTimer) clearInterval(rotationTimer)
    if (!state.value.rotationEnabled || state.value.backgrounds.length < 2) return

    rotationTimer = setInterval(() => {
      rotateNext()
    }, state.value.rotationInterval * 60 * 1000)
  }

  const stopRotation = () => {
    if (rotationTimer) clearInterval(rotationTimer)
    rotationTimer = null
  }

  const rotateNext = () => {
    const bgList = state.value.backgrounds
    if (bgList.length === 0) return

    if (state.value.rotationMode === 'random') {
       const randomIndex = Math.floor(Math.random() * bgList.length)
       state.value.currentBackgroundId = bgList[randomIndex].id
    } else {
       // Sequential
       const currentIndex = bgList.findIndex(b => b.id === state.value.currentBackgroundId)
       const nextIndex = (currentIndex + 1) % bgList.length
       state.value.currentBackgroundId = bgList[nextIndex].id
    }
  }

  // Watch for rotation settings changes
  watch(
    () => [state.value.rotationEnabled, state.value.rotationInterval, state.value.rotationMode],
    () => {
      if (state.value.rotationEnabled) startRotation()
      else stopRotation()
    }
  )

  return {
    state,
    backgrounds, // Deprecated: usage moved to state.backgrounds
    currentBackground,
    defaultGradient,
    loadBackgrounds,
    addBackground,
    removeBackground,
    setBackground,
    rotateNext
  }
})
