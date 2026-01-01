/**
 * useIdleTimer - Detects user inactivity for sleep mode
 * Tracks mouse moves, clicks, and keypresses to reset idle timer
 */
import { ref, onMounted, onUnmounted } from 'vue'

export function useIdleTimer(timeoutMs: number = 5 * 60 * 1000) {
  const isIdle = ref(false)
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const resetTimer = () => {
    isIdle.value = false
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      isIdle.value = true
    }, timeoutMs)
  }

  const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll']

  onMounted(() => {
    events.forEach(event => window.addEventListener(event, resetTimer))
    resetTimer()
  })

  onUnmounted(() => {
    events.forEach(event => window.removeEventListener(event, resetTimer))
    if (timeoutId) clearTimeout(timeoutId)
  })

  return { isIdle, resetTimer }
}
