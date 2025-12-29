import type { WidgetType, WidgetConfig } from './widget';
import type { UUID, Timestamp } from './common';

export interface GridBlock {
  id: UUID;
  type: WidgetType;
  x: number;
  y: number;
  w: number;
  h: number;
  config: WidgetConfig;
  isLocked: boolean;
  zIndex: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface GridState {
  blocks: GridBlock[];
  selectedBlockId: UUID | null;
  historyIndex: number;
}
