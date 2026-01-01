import { ref, watch, type Ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'

// Singleton storage map - ensures only one ref per key across all component instances
const storageInstances = new Map<string, Ref<unknown>>()
const initializedKeys = new Set<string>()

export function useStorage<T>(key: string, initialValue: T): Ref<T> {
  // Return existing instance if already created (singleton)
  if (storageInstances.has(key)) {
    return storageInstances.get(key) as Ref<T>
  }

  const data = ref<T>(initialValue) as Ref<T>
  storageInstances.set(key, data as Ref<unknown>)

  // Load from storage only once per key
  const loadData = () => {
    if (initializedKeys.has(key)) return
    initializedKeys.add(key)

    // 1. Try Chrome Storage (Async)
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.get([key], (result) => {
        if (result[key]) {
          data.value = result[key]
        }
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
    }
  }

  loadData()

  // Debounced Save - immediate first save, then debounce
  const save = useDebounceFn((newValue: T) => {
    // 1. Chrome Storage
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.set({ [key]: newValue })
    } 
    // 2. LocalStorage
    else {
      localStorage.setItem(key, JSON.stringify(newValue))
    }
  }, 100) // Reduced debounce time for faster saves

  watch(data, (newValue) => {
    save(newValue)
  }, { deep: true })

  return data
}
