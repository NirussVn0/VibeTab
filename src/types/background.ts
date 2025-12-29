import type { UUID, Timestamp } from './common';

export type BackgroundType = 'image' | 'gif' | 'video' | 'url';
export type BackgroundPosition = 'cover' | 'contain' | 'stretch';
export type RotationMode = 'random' | 'sequential' | 'time';

export interface Background {
  id: UUID;
  name: string;
  type: BackgroundType;
  source: string; // URL or base64
  size?: number; // bytes
  position: BackgroundPosition;
  isDefault: boolean;
  createdAt: Timestamp;
}

export interface BackgroundState {
  backgrounds: Background[];
  currentBackgroundId: UUID | null;
  rotationMode: RotationMode;
  rotationInterval: number; // minutes
  rotationEnabled: boolean;
  blur: number; // 0-100
  brightness: number; // 0-100 placeholder if needed, Requirement mentions adaptive text
}
