/**
 * useEditableGrid.ts - Shared composable for grid layout editing with 16px snap
 * Used by both Normal Mode and Focus Mode for consistent edit behavior
 */
import { computed, type Ref } from 'vue'
import type { LayoutItem } from '../stores/pomodoroLayout.store'

export interface EditableGridConfig {
  colNum?: number
  rowHeight?: number
  gridSize?: number
  preventCollision?: boolean
  verticalCompact?: boolean
}

const DEFAULT_CONFIG: Required<EditableGridConfig> = {
  colNum: 24,
  rowHeight: 16,
  gridSize: 16,
  preventCollision: true,
  verticalCompact: false
}

export function useEditableGrid(
  items: Ref<LayoutItem[]>,
  config: EditableGridConfig = {}
) {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config }
  
  const gridConfig = computed(() => ({
    colNum: mergedConfig.colNum,
    rowHeight: mergedConfig.rowHeight,
    isDraggable: true,
    isResizable: true,
    verticalCompact: mergedConfig.verticalCompact,
    preventCollision: mergedConfig.preventCollision,
    useCssTransforms: true,
    margin: [0, 0] as [number, number],
    containerPadding: [16, 16] as [number, number]
  }))

  const snapToGrid = (value: number, gridSize: number = mergedConfig.gridSize): number => {
    return Math.round(value / gridSize) * gridSize
  }

  const validatePosition = (item: LayoutItem): LayoutItem => {
    return {
      ...item,
      x: Math.max(0, Math.min(item.x, mergedConfig.colNum - item.w)),
      y: Math.max(0, item.y),
      w: Math.max(item.minW || 1, item.w),
      h: Math.max(item.minH || 1, item.h)
    }
  }

  const checkCollision = (item: LayoutItem, otherItems: LayoutItem[]): boolean => {
    return otherItems.some(other => {
      if (other.i === item.i) return false
      return !(
        item.x + item.w <= other.x ||
        item.x >= other.x + other.w ||
        item.y + item.h <= other.y ||
        item.y >= other.y + other.h
      )
    })
  }

  const updateItem = (itemId: string, updates: Partial<LayoutItem>) => {
    const index = items.value.findIndex(item => item.i === itemId)
    if (index === -1) return

    const updated = validatePosition({ ...items.value[index], ...updates })
    
    if (mergedConfig.preventCollision) {
      const others = items.value.filter(item => item.i !== itemId)
      if (checkCollision(updated, others)) return
    }

    items.value[index] = updated
  }

  return {
    gridConfig,
    snapToGrid,
    validatePosition,
    checkCollision,
    updateItem
  }
}
