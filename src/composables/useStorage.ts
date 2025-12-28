import { ref, watch, type Ref } from 'vue'

export function useStorage<T>(key: string, initialValue: T): Ref<T> {
  // Try to load from localStorage
  const storedValue = localStorage.getItem(key)
  const data = storedValue ? JSON.parse(storedValue) : initialValue
  
  const state = ref<T>(data) as Ref<T>

  // Watch for changes and save to localStorage
  watch(state, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue))
  }, { deep: true })

  return state
}
