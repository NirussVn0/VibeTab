import type { WidgetType, WidgetConfig } from './widget'
import type { UUID, Timestamp } from './common'

export interface GridBlock {
  id: UUID
  type: WidgetType
  x: number
  y: number
  w: number
  h: number
  config: WidgetConfig
  isLocked: boolean
  zIndex: number
  createdAt: Timestamp
  updatedAt: Timestamp
  minW?: number
  minH?: number
  maxW?: number
  maxH?: number
}

export interface GridState {
  blocks: GridBlock[]
  selectedBlockId: UUID | null
  historyIndex: number
}

export interface GridConfig {
  baseCellPx: number
  cellPx: number
  cols: number
  rows: number
  gap: number
  zoomFactor: number
}

export interface GridPosition {
  x: number
  y: number
}

export interface GridDimensions {
  w: number
  h: number
}
