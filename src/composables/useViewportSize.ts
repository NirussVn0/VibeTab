import { ref, onMounted, onUnmounted } from 'vue'

export interface ViewportSize {
  width: number
  height: number
}

// Global shared state
const width = ref(window.innerWidth)
const height = ref(window.innerHeight)
const prevWidth = ref(window.innerWidth)
const prevHeight = ref(window.innerHeight)
let listeners = 0
let resizeObserver: ResizeObserver | null = null
let timeoutId: ReturnType<typeof setTimeout> | null = null

export function useViewportSize(debounceMs = 100) {
  const updateSize = () => {
    prevWidth.value = width.value
    prevHeight.value = height.value
    width.value = window.innerWidth
    height.value = window.innerHeight
  }

  const debouncedUpdate = () => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(updateSize, debounceMs)
  }

  onMounted(() => {
    listeners++
    if (listeners === 1) {
      updateSize() // Initial sync
      resizeObserver = new ResizeObserver(debouncedUpdate)
      resizeObserver.observe(document.documentElement)
    }
  })

  onUnmounted(() => {
    listeners--
    if (listeners === 0) {
      if (timeoutId) clearTimeout(timeoutId)
      resizeObserver?.disconnect()
      resizeObserver = null
    }
  })

  return {
    width,
    height,
    prevWidth,
    prevHeight
  }
}
