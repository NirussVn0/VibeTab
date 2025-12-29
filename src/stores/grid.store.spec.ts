import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGridStore } from './grid.store'
import type { GridBlock } from '../types/grid'

describe('Grid Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with default widgets', () => {
    const store = useGridStore()
    expect(store.widgets.length).toBeGreaterThan(0)
    expect(store.widgets[0].type).toBe('clock')
  })

  it('can add a widget', () => {
    const store = useGridStore()
    const newWidget: GridBlock = {
      id: 'test-1',
      type: 'todo',
      x: 0,
      y: 0,
      w: 2,
      h: 2,
      config: {},
      isLocked: false,
      zIndex: 1,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    store.addWidget(newWidget)
    expect(store.widgets).toContainEqual(newWidget)
  })

  it('can remove a widget', () => {
    const store = useGridStore()
    const idToRemove = store.widgets[0].id
    store.removeWidget(idToRemove)
    expect(store.widgets.find(w => w.id === idToRemove)).toBeUndefined()
  })

  it('can update widget position', () => {
    const store = useGridStore()
    const widget = store.widgets[0]
    const newPos = { x: 5, y: 5, w: 4, h: 4 }
    
    store.updateWidgetPosition(widget.id, newPos)
    
    const updated = store.widgets.find(w => w.id === widget.id)
    expect(updated?.x).toBe(5)
    expect(updated?.y).toBe(5)
    expect(updated?.w).toBe(4)
    expect(updated?.h).toBe(4)
  })
})
