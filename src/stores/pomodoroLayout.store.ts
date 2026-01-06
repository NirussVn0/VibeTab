/**
 * pomodoroLayout.store.ts - Persists Pomodoro UI layout (clock and controls positioning)
 */
import { defineStore } from 'pinia'
import { useStorage } from '../composables/useStorage'

export interface LayoutItem {
  i: string
  x: number
  y: number
  w: number
  h: number
  minW: number
  minH: number
}

const DEFAULT_LAYOUT: LayoutItem[] = [
  { i: 'clock', x: 4, y: 2, w: 16, h: 12, minW: 12, minH: 8 },
  { i: 'controls', x: 4, y: 14, w: 16, h: 6, minW: 12, minH: 4 }
]

export const usePomodoroLayoutStore = defineStore('pomodoroLayout', () => {
  const layout = useStorage('vibetab_pomodoro_layout', DEFAULT_LAYOUT)

  const resetLayout = () => {
    layout.value = [...DEFAULT_LAYOUT]
  }

  return { layout, resetLayout }
})
