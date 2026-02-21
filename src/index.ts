/**
 * @pleme/zustand-patterns
 *
 * Zustand store patterns with immer, persist, devtools, and type-safe modals.
 *
 * @example
 * ```ts
 * import {
 *   createStore,
 *   createPersistedStore,
 *   createModalStore,
 *   createLoadingStore,
 *   createSelector,
 *   isModalDataType,
 * } from '@pleme/zustand-patterns'
 *
 * // Basic store with immer + devtools
 * const useCounterStore = createStore<CounterState>(
 *   (set) => ({
 *     count: 0,
 *     increment: () => set((state) => { state.count += 1 }),
 *   }),
 *   { devtoolsName: 'counter' }
 * )
 *
 * // Persisted store with immer + devtools + localStorage
 * const useAuthStore = createPersistedStore<AuthState>(
 *   (set) => ({
 *     user: null,
 *     login: (user) => set((state) => { state.user = user }),
 *   }),
 *   {
 *     name: 'auth-storage',
 *     partialize: (state) => ({ user: state.user }),
 *   }
 * )
 *
 * // Type-safe modal store with discriminated unions
 * type ModalData =
 *   | { type: 'confirm'; message: string }
 *   | { type: 'edit'; itemId: string }
 *
 * const useModalStore = createModalStore<ModalData>('modals')
 *
 * // Type guard for narrowing modal data
 * if (isModalDataType(modalData, 'confirm')) {
 *   console.log(modalData.message) // TypeScript knows this is ConfirmModalData
 * }
 *
 * // Atomic selectors for performance
 * export const useUser = createSelector(useAuthStore, (s) => s.user)
 * ```
 */

// Types
export type {
  PersistedStoreConfig,
  BasicStoreConfig,
  BaseModalData,
  ModalState,
  ModalActions,
  ModalStore,
  LoadingState,
  LoadingActions,
  LoadingStore,
} from './types'

// Store factories
export { createStore, createPersistedStore } from './create-store'

// Modal store
export { createModalStore, isModalDataType } from './modal-store'

// Loading store
export { createLoadingStore } from './loading-store'

// Selectors
export { createSelector, createSelectors } from './selectors'
