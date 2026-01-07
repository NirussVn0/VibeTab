/**
 * GridLayoutConfig - Shared grid constants for all edit modes.
 * Both Normal Mode and Focus Mode use 16px grid snap.
 */

export const GRID_CELL_SIZE = 16
export const GRID_GAP = 0
export const GRID_MARGIN: [number, number] = [0, 0]

export const snap = (value: number, gridSize = GRID_CELL_SIZE): number => {
  return Math.round(value / gridSize) * gridSize
}

export const pxToCells = (px: number, gridSize = GRID_CELL_SIZE): number => {
  return Math.round(px / gridSize)
}
