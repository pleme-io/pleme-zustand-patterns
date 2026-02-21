/**
 * Store Factory Functions
 *
 * Factory functions for creating Zustand stores with common middleware patterns.
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { StoreApi, UseBoundStore } from 'zustand'
import type { PersistedStoreConfig, BasicStoreConfig } from './types'

/**
 * Create a Zustand store with immer and devtools middleware.
 *
 * @example
 * ```ts
 * interface CounterState {
 *   count: number
 *   increment: () => void
 * }
 *
 * const useCounterStore = createStore<CounterState>(
 *   (set) => ({
 *     count: 0,
 *     increment: () => set((state) => { state.count += 1 }),
 *   }),
 *   { devtoolsName: 'counter-store' }
 * )
 * ```
 */
export function createStore<T extends object>(
  initializer: (
    set: (fn: (state: T) => void) => void,
    get: () => T
  ) => T,
  config?: BasicStoreConfig
): UseBoundStore<StoreApi<T>> {
  return create<T>()(
    devtools(
      immer((set, get) => initializer(set as (fn: (state: T) => void) => void, get)),
      { name: config?.devtoolsName ?? 'store' }
    )
  )
}

/**
 * Create a Zustand store with immer, devtools, and persist middleware.
 *
 * @example
 * ```ts
 * interface AuthState {
 *   user: User | null
 *   isAuthenticated: boolean
 *   login: (user: User) => void
 * }
 *
 * const useAuthStore = createPersistedStore<AuthState>(
 *   (set) => ({
 *     user: null,
 *     isAuthenticated: false,
 *     login: (user) => set((state) => {
 *       state.user = user
 *       state.isAuthenticated = true
 *     }),
 *   }),
 *   {
 *     name: 'auth-storage',
 *     devtoolsName: 'auth-store',
 *     partialize: (state) => ({
 *       user: state.user,
 *       isAuthenticated: state.isAuthenticated,
 *     }),
 *   }
 * )
 * ```
 */
export function createPersistedStore<T extends object>(
  initializer: (
    set: (fn: (state: T) => void) => void,
    get: () => T
  ) => T,
  config: PersistedStoreConfig<T>
): UseBoundStore<StoreApi<T>> {
  return create<T>()(
    devtools(
      persist(
        immer((set, get) => initializer(set as (fn: (state: T) => void) => void, get)),
        {
          name: config.name,
          partialize: config.partialize,
          merge: config.merge,
        }
      ),
      { name: config.devtoolsName ?? config.name }
    )
  )
}
