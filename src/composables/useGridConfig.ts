import { ref, computed, watch } from 'vue'
import { useViewportSize } from './useViewportSize'
import { GridConfigService, type ZoomState } from '../services/GridConfigService'

export interface GridConfig {
  baseCellPx: number
  cellPx: number
  cols: number
  rows: number
  gap: number
  zoomFactor: number
}

const DEFAULT_BASE_CELL_PX = 16
const DEFAULT_GAP = 2

// Shared state
const baseCellPx = ref(DEFAULT_BASE_CELL_PX)
const zoomFactor = ref(1.0)
const stableWidth = ref(0)
const stableHeight = ref(0)

export function useGridConfig(
  initialBaseCellPx = DEFAULT_BASE_CELL_PX,
  gap = DEFAULT_GAP
) {
  // If called with different initial value, update it
  if (initialBaseCellPx !== DEFAULT_BASE_CELL_PX) {
     baseCellPx.value = initialBaseCellPx
  }

  const { width, height, prevWidth, prevHeight } = useViewportSize()

  const dimensions = computed(() =>
    GridConfigService.computeGridDimensions(
      width.value,
      height.value,
      baseCellPx.value,
      zoomFactor.value,
      gap
    )
  )

  const cellPx = computed(() => dimensions.value.cellPx)
  const cols = computed(() => dimensions.value.cols)
  const rows = computed(() => dimensions.value.rows)

  const config = computed<GridConfig>(() => ({
    baseCellPx: baseCellPx.value,
    cellPx: cellPx.value,
    cols: cols.value,
    rows: rows.value,
    gap,
    zoomFactor: zoomFactor.value
  }))

  watch([width, height], () => {
    const zoomState: ZoomState = GridConfigService.computeZoomFactor(
      prevWidth.value,
      prevHeight.value,
      width.value,
      height.value,
      zoomFactor.value,
      stableWidth.value,
      stableHeight.value
    )

    zoomFactor.value = zoomState.factor
    stableWidth.value = zoomState.stableWidth
    stableHeight.value = zoomState.stableHeight
  })

  const setBaseCellPx = (px: number) => {
    baseCellPx.value = Math.max(8, Math.min(48, px))
  }

  const resetZoom = () => {
    zoomFactor.value = 1.0
    stableWidth.value = width.value
    stableHeight.value = height.value
  }

  return {
    config,
    baseCellPx,
    cellPx,
    cols,
    rows,
    zoomFactor,
    gap,
    viewportWidth: width,
    viewportHeight: height,
    setBaseCellPx,
    resetZoom
  }
}
