/**
 * Selector Utilities
 *
 * Utilities for creating atomic selectors that prevent unnecessary re-renders.
 */

import type { StoreApi, UseBoundStore } from 'zustand'

/**
 * Create an atomic selector hook from a store.
 * This creates a hook that only subscribes to a specific slice of state,
 * preventing re-renders when other parts of state change.
 *
 * @example
 * ```ts
 * const useAuthStore = create<AuthState>()((set) => ({
 *   user: null,
 *   isAuthenticated: false,
 *   isLoading: false,
 *   login: (user) => set({ user, isAuthenticated: true }),
 * }))
 *
 * // Create atomic selectors
 * export const useUser = createSelector(useAuthStore, (state) => state.user)
 * export const useIsAuthenticated = createSelector(useAuthStore, (state) => state.isAuthenticated)
 * export const useIsLoading = createSelector(useAuthStore, (state) => state.isLoading)
 *
 * // Use in components - only re-renders when user changes
 * function UserAvatar() {
 *   const user = useUser()
 *   return <img src={user?.avatarUrl} />
 * }
 * ```
 */
export function createSelector<T, R>(
  useStore: UseBoundStore<StoreApi<T>>,
  selector: (state: T) => R
): () => R {
  return () => useStore(selector)
}

/**
 * Create multiple atomic selectors from a store at once.
 *
 * @example
 * ```ts
 * const useAuthStore = create<AuthState>()(...)
 *
 * export const {
 *   useUser,
 *   useIsAuthenticated,
 *   useIsLoading
 * } = createSelectors(useAuthStore, {
 *   useUser: (state) => state.user,
 *   useIsAuthenticated: (state) => state.isAuthenticated,
 *   useIsLoading: (state) => state.isLoading,
 * })
 * ```
 */
export function createSelectors<T, S extends Record<string, (state: T) => unknown>>(
  useStore: UseBoundStore<StoreApi<T>>,
  selectors: S
): { [K in keyof S]: () => ReturnType<S[K]> } {
  const result = {} as { [K in keyof S]: () => ReturnType<S[K]> }

  for (const key in selectors) {
    const selector = selectors[key]
    if (selector) {
      result[key] = () => useStore(selector) as ReturnType<S[typeof key]>
    }
  }

  return result
}
