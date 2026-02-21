/**
 * Loading Store Pattern
 *
 * Global loading state for application-wide loading indicators.
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { StoreApi, UseBoundStore } from 'zustand'
import type { LoadingStore } from './types'

/**
 * Create a global loading store.
 *
 * @example
 * ```ts
 * const useLoadingStore = createLoadingStore('global-loading')
 *
 * // In a component
 * const { isLoading, loadingMessage, setLoading } = useLoadingStore()
 *
 * // Show loading with message
 * setLoading(true, 'Saving changes...')
 *
 * // Hide loading
 * setLoading(false)
 * ```
 */
export function createLoadingStore(devtoolsName = 'loading-store'): UseBoundStore<StoreApi<LoadingStore>> {
  return create<LoadingStore>()(
    devtools(
      immer((set) => ({
        isLoading: false,
        loadingMessage: null,

        setLoading: (loading, message) => {
          set((state) => {
            state.isLoading = loading
            state.loadingMessage = message ?? null
          })
        },
      })),
      { name: devtoolsName }
    )
  )
}
