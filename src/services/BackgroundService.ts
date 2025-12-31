import type { BackgroundType } from '../types/background'

export interface FileValidation {
  isValid: boolean
  error?: string
  type?: BackgroundType
  mimeType?: string
}

export class BackgroundService {
  private static readonly IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
  private static readonly GIF_TYPES = ['image/gif']
  private static readonly VIDEO_TYPES = ['video/mp4', 'video/webm']
  private static readonly MAX_IMAGE_SIZE = 5 * 1024 * 1024
  private static readonly MAX_VIDEO_SIZE = 10 * 1024 * 1024

  private static objectUrls: Set<string> = new Set()

  static validateFile(file: File): FileValidation {
    const mimeType = file.type.toLowerCase()

    if (this.IMAGE_TYPES.includes(mimeType)) {
      if (file.size > this.MAX_IMAGE_SIZE) {
        return { isValid: false, error: `Image must be under ${this.MAX_IMAGE_SIZE / 1024 / 1024}MB` }
      }
      return { isValid: true, type: 'image', mimeType }
    }

    if (this.GIF_TYPES.includes(mimeType)) {
      if (file.size > this.MAX_IMAGE_SIZE) {
        return { isValid: false, error: `GIF must be under ${this.MAX_IMAGE_SIZE / 1024 / 1024}MB` }
      }
      return { isValid: true, type: 'gif', mimeType }
    }

    if (this.VIDEO_TYPES.includes(mimeType)) {
      if (file.size > this.MAX_VIDEO_SIZE) {
        return { isValid: false, error: `Video must be under ${this.MAX_VIDEO_SIZE / 1024 / 1024}MB` }
      }
      return { isValid: true, type: 'video', mimeType }
    }

    return {
      isValid: false,
      error: `Unsupported file type. Supported: PNG, JPG, JPEG, WebP, GIF, MP4, WebM`
    }
  }

  static validateUrl(url: string): FileValidation {
    try {
      const parsed = new URL(url)
      const path = parsed.pathname.toLowerCase()

      if (/\.(png|jpe?g|webp)$/i.test(path)) {
        return { isValid: true, type: 'image' }
      }
      if (/\.gif$/i.test(path)) {
        return { isValid: true, type: 'gif' }
      }
      if (/\.(mp4|webm)$/i.test(path)) {
        return { isValid: true, type: 'video' }
      }

      return { isValid: true, type: 'url' }
    } catch {
      return { isValid: false, error: 'Invalid URL format' }
    }
  }

  static isVideoType(type: BackgroundType): boolean {
    return type === 'video'
  }

  static isImageType(type: BackgroundType): boolean {
    return type === 'image' || type === 'gif'
  }

  static createObjectUrl(blob: Blob): string {
    const url = URL.createObjectURL(blob)
    this.objectUrls.add(url)
    return url
  }

  static revokeObjectUrl(url: string): void {
    if (this.objectUrls.has(url)) {
      URL.revokeObjectURL(url)
      this.objectUrls.delete(url)
    }
  }

  static revokeAllObjectUrls(): void {
    this.objectUrls.forEach(url => URL.revokeObjectURL(url))
    this.objectUrls.clear()
  }

  static getAcceptedFileTypes(): string {
    return [...this.IMAGE_TYPES, ...this.GIF_TYPES, ...this.VIDEO_TYPES].join(',')
  }

  static formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }
}
