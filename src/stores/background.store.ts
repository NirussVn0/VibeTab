import { defineStore } from 'pinia'
import { computed, watch } from 'vue'
import { useStorage } from '../composables/useStorage'
import { mediaDB } from '../utils/indexedDB'
import { BackgroundService } from '../services/BackgroundService'
import type { BackgroundState, BackgroundType } from '../types/background'

export const useBackgroundStore = defineStore('background', () => {
  const state = useStorage<BackgroundState>('vibetab_background_state', {
    backgrounds: [],
    currentBackgroundId: null,
    rotationMode: 'random',
    rotationInterval: 60,
    rotationEnabled: false,
    blur: 0,
    brightness: 100
  })

  const defaultGradient = 'linear-gradient(135deg, #218085 0%, #1a6872 100%)'

  const currentBackground = computed(() => {
    if (!state.value.currentBackgroundId) return null
    return state.value.backgrounds.find(b => b.id === state.value.currentBackgroundId) || null
  })

  const loadBackgrounds = async () => {
    // Rehydrate blob URLs from IndexedDB
    // Direct mutation allowed here as it's initialization
    const newBackgrounds = [...state.value.backgrounds]
    let changed = false

    for (const bg of newBackgrounds) {
      const stored = await mediaDB.get(bg.id)
      if (stored?.blob) {
        if (bg.source && bg.source.startsWith('blob:')) {
           URL.revokeObjectURL(bg.source)
        }
        bg.source = BackgroundService.createObjectUrl(stored.blob)
        changed = true
      }
    }
    
    if (changed) {
        state.value.backgrounds = newBackgrounds
    }
  }

  const addBackground = async (file: File): Promise<{ success: boolean; error?: string }> => {
    const validation = BackgroundService.validateFile(file)

    if (!validation.isValid) {
      return { success: false, error: validation.error }
    }

    const id = crypto.randomUUID()
    const blob = new Blob([file], { type: file.type })

    await mediaDB.save(id, blob)
    const objectUrl = BackgroundService.createObjectUrl(blob)

    const newBg = {
      id,
      name: file.name,
      type: validation.type as BackgroundType,
      source: objectUrl,
      addedAt: Date.now(),
      size: file.size,
      position: 'cover',
      isDefault: false,
      version: 1, // Init version
      createdAt: Date.now()
    } as const

    // Immutable update
    state.value.backgrounds = [...state.value.backgrounds, newBg]
    
    // Auto-select the newly added background
    state.value.currentBackgroundId = id
    
    return { success: true }
  }

  const addBackgroundFromUrl = async (url: string): Promise<{ success: boolean; error?: string }> => {
    console.log('[BackgroundStore] addBackgroundFromUrl called with:', url)
    
    const validation = BackgroundService.validateUrl(url)

    if (!validation.isValid) {
      console.log('[BackgroundStore] Invalid URL:', validation.error)
      return { success: false, error: validation.error }
    }

    const id = crypto.randomUUID()
    console.log('[BackgroundStore] Generated ID:', id, 'Type:', validation.type)

    const newBg = {
      id,
      name: new URL(url).pathname.split('/').pop() || 'URL Background',
      type: validation.type as BackgroundType,
      source: url,
      addedAt: Date.now(),
      position: 'cover',
      isDefault: false,
      version: 1,
      createdAt: Date.now()
    } as const

    console.log('[BackgroundStore] Before update - backgrounds:', state.value.backgrounds.length, 'currentId:', state.value.currentBackgroundId)
    
    state.value.backgrounds = [...state.value.backgrounds, newBg]
    state.value.currentBackgroundId = id
    
    console.log('[BackgroundStore] After update - backgrounds:', state.value.backgrounds.length, 'currentId:', state.value.currentBackgroundId)
    console.log('[BackgroundStore] currentBackground computed:', currentBackground.value)

    return { success: true }
  }

  const removeBackground = async (id: string) => {
    const bg = state.value.backgrounds.find(b => b.id === id)
    if (bg?.source?.startsWith('blob:')) {
      BackgroundService.revokeObjectUrl(bg.source)
    }

    await mediaDB.delete(id)
    
    // Immutable remove
    state.value.backgrounds = state.value.backgrounds.filter(b => b.id !== id)

    if (state.value.currentBackgroundId === id) {
      state.value.currentBackgroundId = null
    }
  }

  const setBackground = async (input: string | File): Promise<{ success: boolean; error?: string }> => {
    if (typeof input === 'string') {
      const existingBg = state.value.backgrounds.find(b => b.id === input)
      if (existingBg) {
        state.value.currentBackgroundId = input;
        
        // Force refresh by incrementing version only if it's the same background being selected again
        // This ensures UI updates even when the same background is selected again
        const bgIndex = state.value.backgrounds.findIndex(b => b.id === input)
        if (bgIndex !== -1) {
          const updatedBg = { ...state.value.backgrounds[bgIndex] }
          updatedBg.version = (updatedBg.version || 0) + 1
          
          // Create a new array to ensure reactivity
          const newBackgrounds = [...state.value.backgrounds]
          newBackgrounds[bgIndex] = updatedBg
          state.value.backgrounds = newBackgrounds
        }

        return { success: true }
      }
      return addBackgroundFromUrl(input)
    }

    const result = await addBackground(input)
    if (result.success) {
      const newBg = state.value.backgrounds[state.value.backgrounds.length - 1]
      if (newBg) state.value.currentBackgroundId = newBg.id
    }
    return result
  }

  const resetBackground = () => {
    state.value.currentBackgroundId = null
  }
  
  // Rotation Logic
  let rotationTimer: ReturnType<typeof setInterval> | null = null

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

    let nextId: string

    if (state.value.rotationMode === 'random') {
      const randomIndex = Math.floor(Math.random() * bgList.length)
      nextId = bgList[randomIndex].id
    } else {
      const currentIndex = bgList.findIndex(b => b.id === state.value.currentBackgroundId)
      const nextIndex = (currentIndex + 1) % bgList.length
      nextId = bgList[nextIndex].id
    }
    
    state.value.currentBackgroundId = nextId
    
    // Bump version to force refresh if it was arguably the same
    const bgIndex = state.value.backgrounds.findIndex(b => b.id === nextId)
    if (bgIndex !== -1) {
        const updatedBg = { ...state.value.backgrounds[bgIndex] }
        updatedBg.version = (updatedBg.version || 0) + 1
        const newBackgrounds = [...state.value.backgrounds]
        newBackgrounds[bgIndex] = updatedBg
        state.value.backgrounds = newBackgrounds
    }
  }

  watch(
    () => [state.value.rotationEnabled, state.value.rotationInterval, state.value.rotationMode],
    () => {
      if (state.value.rotationEnabled) startRotation()
      else stopRotation()
    }
  )

  return {
    state,
    currentBackground,
    defaultGradient,
    loadBackgrounds,
    addBackground,
    addBackgroundFromUrl,
    removeBackground,
    setBackground,
    resetBackground,
    rotateNext
  }
})