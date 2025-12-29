import type { GridBlock } from '../types/grid';

/**
 * GridManager encapsulates all logic related to the Grid layout.
 * It handles collision detection, empty slot finding, and layout validation.
 * Pure logic class, strictly decoupled from Vue reactivity.
 */
export class GridManager {
  private columns: number;
  private maxRows: number; // Optional limit, effectively infinite for scrollable

  constructor(columns: number = 12, maxRows: number = 100) {
    this.columns = columns;
    this.maxRows = maxRows;
  }

  /**
   * Checks if two blocks collide.
   */
  public static checkCollision(a: GridBlock, b: GridBlock): boolean {
    if (a.id === b.id) return false; // Self comparison
    
    return (
      a.x < b.x + b.w &&
      a.x + a.w > b.x &&
      a.y < b.y + b.h &&
      a.y + a.h > b.y
    );
  }

  /**
   * Checks if a target block collides with any other block in the list.
   * Returns the colliding block or null.
   */
  public findCollision(target: GridBlock, blocks: GridBlock[]): GridBlock | null {
    for (const block of blocks) {
      if (GridManager.checkCollision(target, block)) {
        return block;
      }
    }
    return null;
  }

  /**
   * Validates if a block is within the grid boundaries.
   */
  public isValidPosition(block: GridBlock): boolean {
    return (
      block.x >= 0 &&
      block.x + block.w <= this.columns &&
      block.y >= 0
    );
  }

  /**
   * Finds the first available empty slot for a widget of given size.
   * Scans from top-left to bottom-right.
   */
  public findEmptySlot(blocks: GridBlock[], w: number, h: number): { x: number; y: number } {
    const gridMap = this.createGridMap(blocks);
    
    for (let y = 0; y < this.maxRows; y++) {
      for (let x = 0; x <= this.columns - w; x++) {
        if (this.isAreaEmpty(gridMap, x, y, w, h)) {
          return { x, y };
        }
      }
    }
    
    // Fallback: append to the very bottom
    return { x: 0, y: this.getLastRow(blocks) + 1 };
  }

  /**
   * Helper: Creates a boolean map of occupied cells.
   */
  private createGridMap(blocks: GridBlock[]): Set<string> {
    const map = new Set<string>();
    blocks.forEach(block => {
      for (let dy = 0; dy < block.h; dy++) {
        for (let dx = 0; dx < block.w; dx++) {
          map.add(`${block.x + dx},${block.y + dy}`);
        }
      }
    });
    return map;
  }

  /**
   * Helper: Checks if a specific area is empty in the map.
   */
  private isAreaEmpty(map: Set<string>, startX: number, startY: number, w: number, h: number): boolean {
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        if (map.has(`${startX + dx},${startY + dy}`)) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Helper: Gets the index of the last occupied row.
   */
  public getLastRow(blocks: GridBlock[]): number {
    let maxRow = 0;
    blocks.forEach(block => {
      maxRow = Math.max(maxRow, block.y + block.h);
    });
    return maxRow;
  }

  /**
   * Updates grid column count (responsive resize).
   * Could include logic to reflow widgets if needed.
   */
  public setColumns(cols: number): void {
    this.columns = cols;
  }
}
