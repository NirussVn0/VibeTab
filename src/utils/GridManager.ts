/**
 * GridManager.ts - Logic for grid positioning, collision detection, and magnetic snapping
 */
import type { GridBlock } from '../types/grid'

export class GridManager {
  private columns: number
  private rows: number

  constructor(columns = 12, rows = 100) {
    this.columns = columns
    this.rows = rows
  }

  static checkCollision(a: GridBlock, b: GridBlock): boolean {
    if (a.id === b.id) return false

    return (
      a.x < b.x + b.w &&
      a.x + a.w > b.x &&
      a.y < b.y + b.h &&
      a.y + a.h > b.y
    )
  }

  findCollision(target: GridBlock, blocks: GridBlock[]): GridBlock | null {
    for (const block of blocks) {
      if (GridManager.checkCollision(target, block)) {
        return block
      }
    }
    return null
  }

  isValidPosition(block: GridBlock): boolean {
    return (
      block.x >= 0 &&
      block.x + block.w <= this.columns &&
      block.y >= 0 &&
      block.y + block.h <= this.rows
    )
  }

  findEmptySlot(blocks: GridBlock[], w: number, h: number): { x: number; y: number } {
    const gridMap = this.createGridMap(blocks)

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x <= this.columns - w; x++) {
        if (this.isAreaEmpty(gridMap, x, y, w, h)) {
          return { x, y }
        }
      }
    }

    return { x: 0, y: this.getLastRow(blocks) + 1 }
  }

  private createGridMap(blocks: GridBlock[]): Set<string> {
    const map = new Set<string>()
    blocks.forEach(block => {
      for (let dy = 0; dy < block.h; dy++) {
        for (let dx = 0; dx < block.w; dx++) {
          map.add(`${block.x + dx},${block.y + dy}`)
        }
      }
    })
    return map
  }

  private isAreaEmpty(map: Set<string>, startX: number, startY: number, w: number, h: number): boolean {
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        if (map.has(`${startX + dx},${startY + dy}`)) {
          return false
        }
      }
    }
    return true
  }

  getLastRow(blocks: GridBlock[]): number {
    let maxRow = 0
    blocks.forEach(block => {
      maxRow = Math.max(maxRow, block.y + block.h)
    })
    return maxRow
  }

  setDimensions(cols: number, rows: number): void {
    this.columns = cols
    this.rows = rows
  }

  getColumns(): number {
    return this.columns
  }

  getRows(): number {
    return this.rows
  }

  findNearestEmptySlot(
    blocks: GridBlock[], 
    targetX: number, 
    targetY: number, 
    w: number, 
    h: number, 
    excludeId?: string
  ): { x: number; y: number } {
    const blocksToCheck = excludeId ? blocks.filter(b => b.id !== excludeId) : blocks
    const gridMap = this.createGridMap(blocksToCheck)
    
    let bestPos = { x: targetX, y: targetY }
    let minDist = Infinity

    const searchRadius = Math.max(this.columns, this.rows)
    
    for (let dist = 0; dist <= searchRadius; dist++) {
      for (let dy = -dist; dy <= dist; dy++) {
        for (let dx = -dist; dx <= dist; dx++) {
          if (Math.abs(dx) !== dist && Math.abs(dy) !== dist) continue
          
          const testX = targetX + dx
          const testY = targetY + dy
          
          if (testX < 0 || testX + w > this.columns || testY < 0 || testY + h > this.rows) continue
          
          if (this.isAreaEmpty(gridMap, testX, testY, w, h)) {
            const distance = Math.sqrt(dx * dx + dy * dy)
            if (distance < minDist) {
              minDist = distance
              bestPos = { x: testX, y: testY }
            }
          }
        }
      }
      if (minDist < Infinity) break
    }
    
    return bestPos
  }

  clampPosition(x: number, y: number, w: number, h: number): { x: number; y: number } {
    return {
      x: Math.max(0, Math.min(x, this.columns - w)),
      y: Math.max(0, Math.min(y, this.rows - h))
    }
  }
}

