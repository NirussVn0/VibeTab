/**
 * useEditableGrid - Shared composable for editable grid layout functionality.
 * Provides 16x16px grid snap, drag/resize state, and layout persistence.
 */
import { ref, computed, watch, type Ref } from 'vue'
import { useStorage } from './useStorage'

export interface GridLayoutItem {
  i: string
  x: number
  y: number
  w: number
  h: number
  static?: boolean
  minW?: number
  minH?: number
  maxW?: number
  maxH?: number
}

export interface EditableGridConfig {
  cellSize?: number
  storageKey: string
  defaultLayout: GridLayoutItem[]
  preventCollision?: boolean
  verticalCompact?: boolean
}

const DEFAULT_CELL_SIZE = 16

export function useEditableGrid(config: EditableGridConfig) {
  const {
    cellSize = DEFAULT_CELL_SIZE,
    storageKey,
    defaultLayout,
    preventCollision = true,
    verticalCompact = false
  } = config

  const cols = computed(() => Math.floor(window.innerWidth / cellSize))
  const rowHeight = cellSize

  const persistedLayout = useStorage(storageKey, defaultLayout)
  const layout: Ref<GridLayoutItem[]> = ref([...persistedLayout.value])
  const isEditMode = ref(false)

  watch(layout, (newLayout) => {
    persistedLayout.value = newLayout.map(item => ({
      i: item.i,
      x: item.x,
      y: item.y,
      w: item.w,
      h: item.h,
      minW: item.minW,
      minH: item.minH,
      maxW: item.maxW,
      maxH: item.maxH,
      static: !isEditMode.value
    }))
  }, { deep: true })

  watch(isEditMode, (editing) => {
    layout.value = layout.value.map(item => ({
      ...item,
      static: !editing
    }))
  })

  const toggleEditMode = () => {
    isEditMode.value = !isEditMode.value
  }

  const enterEditMode = () => {
    isEditMode.value = true
  }

  const exitEditMode = () => {
    isEditMode.value = false
  }

  const resetLayout = () => {
    layout.value = defaultLayout.map(item => ({
      ...item,
      static: !isEditMode.value
    }))
  }

  const updateItem = (id: string, updates: Partial<GridLayoutItem>) => {
    const index = layout.value.findIndex(item => item.i === id)
    if (index !== -1) {
      layout.value[index] = { ...layout.value[index], ...updates }
    }
  }

  const gridLayoutProps = computed(() => ({
    colNum: cols.value,
    rowHeight,
    margin: [0, 0] as [number, number],
    isDraggable: isEditMode.value,
    isResizable: isEditMode.value,
    preventCollision,
    verticalCompact,
    useCssTransforms: true
  }))

  const gridBackgroundStyle = computed(() => ({
    backgroundImage: `
      linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
    `,
    backgroundSize: `${cellSize}px ${cellSize}px`
  }))

  return {
    layout,
    isEditMode,
    cols,
    rowHeight,
    cellSize,
    gridLayoutProps,
    gridBackgroundStyle,
    toggleEditMode,
    enterEditMode,
    exitEditMode,
    resetLayout,
    updateItem
  }
}
