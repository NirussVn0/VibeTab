/**
 * pomodoroLayout.store.ts - Persists Pomodoro UI layout with collision detection
 */
import { defineStore } from 'pinia'
import { useStorage } from '../composables/useStorage'
import { GridManager } from '../utils/GridManager'
import type { GridBlock } from '../types/grid'

export interface LayoutItem {
  i: string // id
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

// Grid configuration for Focus Mode
const COLS = 24
const ROWS = 100 // Arbitrary logical height

export const usePomodoroLayoutStore = defineStore('pomodoroLayout', () => {
  const layout = useStorage('vibetab_pomodoro_layout', DEFAULT_LAYOUT)
  const gridManager = new GridManager(COLS, ROWS)

  const resetLayout = () => {
    layout.value = [...DEFAULT_LAYOUT]
  }

  // Convert LayoutItem to GridBlock-compatible object for GridManager
  const toGridBlock = (item: LayoutItem): GridBlock => ({
    id: item.i,
    type: 'clock', // Dummy type
    x: item.x,
    y: item.y,
    w: item.w,
    h: item.h,
    config: {}, // Dummy config
    isLocked: false,
    zIndex: 0,
    createdAt: 0,
    updatedAt: 0
  })

  const updateItem = (id: string, updates: { x: number; y: number; w?: number; h?: number }) => {
    const index = layout.value.findIndex(item => item.i === id)
    if (index === -1) return

    const currentItem = layout.value[index]
    const updatedItem = { ...currentItem, ...updates }

    // Validate bounds
    const clamped = gridManager.clampPosition(updatedItem.x, updatedItem.y, updatedItem.w, updatedItem.h)
    updatedItem.x = clamped.x
    updatedItem.y = clamped.y

    // Check collision
    const blocks = layout.value.map(toGridBlock)
    const targetBlock = toGridBlock(updatedItem)
    const collision = gridManager.findCollision(targetBlock, blocks)

    if (collision) {
      // If collision, find nearest empty slot
      const nearest = gridManager.findNearestEmptySlot(
        blocks,
        updatedItem.x,
        updatedItem.y,
        updatedItem.w,
        updatedItem.h,
        id // exclude self
      )
      updatedItem.x = nearest.x
      updatedItem.y = nearest.y
    }

    // Apply update
    layout.value[index] = updatedItem
  }

  return { layout, resetLayout, updateItem, COLS, ROWS }
})
