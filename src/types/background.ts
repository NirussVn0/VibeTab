import type { UUID, Timestamp } from './common'

export type BackgroundType = 'image' | 'gif' | 'video' | 'url'
export type BackgroundPosition = 'cover' | 'contain' | 'stretch'
export type RotationMode = 'random' | 'sequential' | 'time'

export interface Background {
  id: UUID
  name: string
  type: BackgroundType
  source: string
  addedAt?: number
  size?: number
  position: BackgroundPosition
  isDefault: boolean
  version: number
  createdAt: Timestamp
}

export interface BackgroundState {
  backgrounds: Background[]
  currentBackgroundId: UUID | null
  rotationMode: RotationMode
  rotationInterval: number
  rotationEnabled: boolean
  blur: number
  brightness: number
}

export interface BackgroundValidation {
  isValid: boolean
  error?: string
  type?: BackgroundType
  mimeType?: string
}
