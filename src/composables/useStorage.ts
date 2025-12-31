import { ref, watch, type Ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'

export function useStorage<T>(key: string, initialValue: T) {
  const data = ref<T>(initialValue) as Ref<T>
  const isReady = ref(false)

  const loadData = () => {
    // 1. Try Chrome Storage (Async)
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.get([key], (result) => {
        if (result[key]) {
          data.value = result[key]
        }
        isReady.value = true
      })
    } 
    // 2. Fallback to LocalStorage (Sync)
    else {
      const stored = localStorage.getItem(key)
      if (stored) {
        try {
          data.value = JSON.parse(stored)
        } catch (e) {
          console.error('Failed to parse storage key:', key, e)
        }
      }
      isReady.value = true
    }
  }

  loadData()

  // Debounced Save
  const save = useDebounceFn((newValue: T) => {
    // 1. Chrome Storage
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.set({ [key]: newValue })
    } 
    // 2. LocalStorage
    else {
      localStorage.setItem(key, JSON.stringify(newValue))
    }
  }, 300)

  watch(data, (newValue) => {
    save(newValue)
  }, { deep: true })

  return { state: data, isReady }
}
