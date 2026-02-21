import { describe, it, expect } from 'vitest'
import { create } from 'zustand'
import { createSelector, createSelectors } from './selectors'

describe('selectors', () => {
  interface TestState {
    count: number
    name: string
    items: string[]
  }

  const createTestStore = () =>
    create<TestState>()(() => ({
      count: 10,
      name: 'Test',
      items: ['a', 'b', 'c'],
    }))

  describe('createSelector', () => {
    it('creates a selector hook', () => {
      const useStore = createTestStore()
      const useCount = createSelector(useStore, (state) => state.count)

      // The selector should return the selected value
      expect(useCount()).toBe(10)
    })

    it('selects different parts of state', () => {
      const useStore = createTestStore()
      const useName = createSelector(useStore, (state) => state.name)
      const useItems = createSelector(useStore, (state) => state.items)

      expect(useName()).toBe('Test')
      expect(useItems()).toEqual(['a', 'b', 'c'])
    })

    it('can select derived values', () => {
      const useStore = createTestStore()
      const useDoubleCount = createSelector(useStore, (state) => state.count * 2)
      const useItemCount = createSelector(useStore, (state) => state.items.length)

      expect(useDoubleCount()).toBe(20)
      expect(useItemCount()).toBe(3)
    })
  })

  describe('createSelectors', () => {
    it('creates multiple selector hooks at once', () => {
      const useStore = createTestStore()

      const selectors = createSelectors(useStore, {
        useCount: (state) => state.count,
        useName: (state) => state.name,
        useItems: (state) => state.items,
      })

      expect(selectors.useCount()).toBe(10)
      expect(selectors.useName()).toBe('Test')
      expect(selectors.useItems()).toEqual(['a', 'b', 'c'])
    })

    it('supports derived selectors', () => {
      const useStore = createTestStore()

      const selectors = createSelectors(useStore, {
        useDoubleCount: (state) => state.count * 2,
        useUpperName: (state) => state.name.toUpperCase(),
        useFirstItem: (state) => state.items[0],
      })

      expect(selectors.useDoubleCount()).toBe(20)
      expect(selectors.useUpperName()).toBe('TEST')
      expect(selectors.useFirstItem()).toBe('a')
    })
  })
})
