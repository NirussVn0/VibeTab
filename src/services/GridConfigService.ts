import type { GridBlock } from '../types/grid'

export interface GridDimensions {
  cols: number
  rows: number
  cellPx: number
  totalWidth: number
  totalHeight: number
}

export interface ZoomState {
  factor: number
  stableWidth: number
  stableHeight: number
}

export class GridConfigService {
  private static readonly ZOOM_THRESHOLD = 0.1
  private static readonly MIN_ZOOM = 0.7
  private static readonly MAX_ZOOM = 1.0
  private static readonly ZOOM_STEP = 0.05

  static computeGridDimensions(
    viewportWidth: number,
    viewportHeight: number,
    baseCellPx: number,
    zoomFactor: number,
    gap: number
  ): GridDimensions {
    const cellPx = Math.floor(baseCellPx * zoomFactor)
    const effectiveCellSize = cellPx + gap

    const cols = Math.floor((viewportWidth + gap) / effectiveCellSize)
    const rows = Math.floor((viewportHeight + gap) / effectiveCellSize)

    return {
      cols: Math.max(1, cols),
      rows: Math.max(1, rows),
      cellPx,
      totalWidth: cols * cellPx + (cols - 1) * gap,
      totalHeight: rows * cellPx + (rows - 1) * gap
    }
  }

  static pxToCells(px: number, cellPx: number, gap: number): number {
    const effectiveSize = cellPx + gap
    // Round to nearest cell unit
    return Math.round((px + gap) / effectiveSize)
  }

  static cellsToPx(cells: number, cellPx: number, gap: number): number {
    return cells * cellPx + (cells - 1) * gap
  }

  static computeZoomFactor(
    _prevWidth: number,
    _prevHeight: number,
    currentWidth: number,
    currentHeight: number,
    currentZoom: number,
    stableWidth: number,
    stableHeight: number
  ): ZoomState {
    if (stableWidth === 0 || stableHeight === 0) {
      return {
        factor: currentZoom,
        stableWidth: currentWidth,
        stableHeight: currentHeight
      }
    }

    const widthDelta = (currentWidth - stableWidth) / stableWidth
    const heightDelta = (currentHeight - stableHeight) / stableHeight

    const bothGrew = widthDelta > this.ZOOM_THRESHOLD && heightDelta > this.ZOOM_THRESHOLD
    const bothShrunk = widthDelta < -this.ZOOM_THRESHOLD && heightDelta < -this.ZOOM_THRESHOLD

    let newZoom = currentZoom
    let newStableWidth = stableWidth
    let newStableHeight = stableHeight

    if (bothGrew) {
      newZoom = Math.max(this.MIN_ZOOM, currentZoom - this.ZOOM_STEP)
      newStableWidth = currentWidth
      newStableHeight = currentHeight
    } else if (bothShrunk) {
      newZoom = Math.min(this.MAX_ZOOM, currentZoom + this.ZOOM_STEP)
      newStableWidth = currentWidth
      newStableHeight = currentHeight
    }

    return {
      factor: newZoom,
      stableWidth: newStableWidth,
      stableHeight: newStableHeight
    }
  }

  static clampWidgetBounds(
    widget: GridBlock,
    cols: number,
    rows: number
  ): { x: number; y: number; w: number; h: number } {
    const w = Math.min(widget.w, cols)
    const h = Math.min(widget.h, rows)
    const x = Math.max(0, Math.min(widget.x, cols - w))
    const y = Math.max(0, Math.min(widget.y, rows - h))

    return { x, y, w, h }
  }

  static isWithinBounds(
    x: number,
    y: number,
    w: number,
    h: number,
    cols: number,
    rows: number
  ): boolean {
    return x >= 0 && y >= 0 && x + w <= cols && y + h <= rows
  }
}
