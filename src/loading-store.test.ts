import { describe, it, expect } from 'vitest'
import { createLoadingStore } from './loading-store'
import { act } from '@testing-library/react'

describe('loading-store', () => {
  describe('createLoadingStore', () => {
    it('creates a loading store with false initial state', () => {
      const useLoadingStore = createLoadingStore('test-loading')

      expect(useLoadingStore.getState().isLoading).toBe(false)
      expect(useLoadingStore.getState().loadingMessage).toBe(null)
    })

    it('sets loading to true', () => {
      const useLoadingStore = createLoadingStore('test-loading')

      act(() => {
        useLoadingStore.getState().setLoading(true)
      })

      expect(useLoadingStore.getState().isLoading).toBe(true)
      expect(useLoadingStore.getState().loadingMessage).toBe(null)
    })

    it('sets loading with message', () => {
      const useLoadingStore = createLoadingStore('test-loading')

      act(() => {
        useLoadingStore.getState().setLoading(true, 'Loading data...')
      })

      expect(useLoadingStore.getState().isLoading).toBe(true)
      expect(useLoadingStore.getState().loadingMessage).toBe('Loading data...')
    })

    it('clears loading and message', () => {
      const useLoadingStore = createLoadingStore('test-loading')

      act(() => {
        useLoadingStore.getState().setLoading(true, 'Loading...')
      })

      act(() => {
        useLoadingStore.getState().setLoading(false)
      })

      expect(useLoadingStore.getState().isLoading).toBe(false)
      expect(useLoadingStore.getState().loadingMessage).toBe(null)
    })
  })
})
