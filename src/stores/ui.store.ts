import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

export const useUIStore = defineStore('ui', () => {
  const isLoading = ref(false)
  const loadingMessage = ref('')

  const startLoading = (msg = '') => {
    isLoading.value = true
    loadingMessage.value = msg
  }

  const stopLoading = () => {
    isLoading.value = false
    loadingMessage.value = ''
  }

  const toasts = ref<Toast[]>([])

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString()
    const newToast = { ...toast, id }
    toasts.value.push(newToast)

    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration || 3000)
    }
  }

  const removeToast = (id: string) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  const isSettingsOpen = ref(false)
  const activeWidgetId = ref<string | null>(null)
  
  const toggleSettings = () => isSettingsOpen.value = !isSettingsOpen.value
  const openSettings = () => isSettingsOpen.value = true
  const closeSettings = () => {
    isSettingsOpen.value = false
    activeWidgetId.value = null
  }
  const setActiveWidgetId = (id: string) => activeWidgetId.value = id
  const clearActiveWidgetId = () => activeWidgetId.value = null

  const isEditMode = ref(false)
  const toggleEditMode = () => isEditMode.value = !isEditMode.value

  const areWidgetsVisible = ref(true)
  const toggleWidgetsVisibility = () => areWidgetsVisible.value = !areWidgetsVisible.value

  return {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading,
    toasts,
    addToast,
    removeToast,
    isSettingsOpen,
    activeWidgetId,
    toggleSettings,
    openSettings,
    closeSettings,
    setActiveWidgetId,
    clearActiveWidgetId,
    isEditMode,
    toggleEditMode,
    areWidgetsVisible,
    toggleWidgetsVisibility
  }
})

