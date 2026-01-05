/**
 * auth.store.ts - User authentication state (mock implementation)
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthModalOpen = ref(false)

  const isLoggedIn = computed(() => user.value !== null)
  const displayName = computed(() => user.value?.name || 'Guest')

  const openAuthModal = () => { isAuthModalOpen.value = true }
  const closeAuthModal = () => { isAuthModalOpen.value = false }

  const mockLogin = () => {
    user.value = {
      id: 'mock-001',
      name: 'Mr.Melatonin',
      email: 'melatonin@vibetab.app',
      avatar: undefined
    }
    closeAuthModal()
  }

  const logout = () => {
    user.value = null
  }

  return { user, isAuthModalOpen, isLoggedIn, displayName, openAuthModal, closeAuthModal, mockLogin, logout }
})
