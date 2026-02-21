import { describe, it, expect } from 'vitest'
import { createStore, createPersistedStore } from './create-store'
import { act } from '@testing-library/react'

describe('create-store', () => {
  describe('createStore', () => {
    it('creates a store with initial state', () => {
      interface TestState {
        count: number
        increment: () => void
      }

      const useStore = createStore<TestState>(
        (set) => ({
          count: 0,
          increment: () => set((state) => { state.count += 1 }),
        }),
        { devtoolsName: 'test-store' }
      )

      expect(useStore.getState().count).toBe(0)
    })

    it('allows state mutations with immer', () => {
      interface TestState {
        items: string[]
        addItem: (item: string) => void
      }

      const useStore = createStore<TestState>(
        (set) => ({
          items: [],
          addItem: (item) => set((state) => { state.items.push(item) }),
        })
      )

      act(() => {
        useStore.getState().addItem('test')
      })

      expect(useStore.getState().items).toEqual(['test'])
    })

    it('provides access to current state via get', () => {
      interface TestState {
        count: number
        doubleCount: () => number
      }

      const useStore = createStore<TestState>(
        (set, get) => ({
          count: 5,
          doubleCount: () => get().count * 2,
        })
      )

      expect(useStore.getState().doubleCount()).toBe(10)
    })
  })

  describe('createPersistedStore', () => {
    it('creates a store with persistence config', () => {
      interface TestState {
        user: string | null
        setUser: (user: string) => void
      }

      const useStore = createPersistedStore<TestState>(
        (set) => ({
          user: null,
          setUser: (user) => set((state) => { state.user = user }),
        }),
        {
          name: 'test-storage',
          devtoolsName: 'test-persisted',
        }
      )

      expect(useStore.getState().user).toBe(null)
    })

    it('supports partialize for selective persistence', () => {
      interface TestState {
        user: string | null
        isLoading: boolean
        setUser: (user: string) => void
      }

      const useStore = createPersistedStore<TestState>(
        (set) => ({
          user: null,
          isLoading: false,
          setUser: (user) => set((state) => { state.user = user }),
        }),
        {
          name: 'test-partial',
          partialize: (state) => ({ user: state.user }),
        }
      )

      // Store should work normally
      act(() => {
        useStore.getState().setUser('John')
      })

      expect(useStore.getState().user).toBe('John')
    })
  })
})
