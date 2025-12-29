import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBackgroundStore } from './background.store'

describe('Background Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with default state', () => {
    const store = useBackgroundStore()
    expect(store.state.rotationMode).toBe('random')
    expect(store.currentBackground).toBeNull()
  })

  it('provides a default gradient when no background set', () => {
    const store = useBackgroundStore()
    expect(store.defaultGradient).toBeDefined()
  })
})
