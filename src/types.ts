/**
 * Zustand Patterns Types
 */

import type { StateCreator, StoreApi, UseBoundStore } from 'zustand'

/**
 * Configuration for creating a persisted store
 */
export interface PersistedStoreConfig<T> {
  /** Storage name for persistence */
  name: string
  /** Devtools name (defaults to storage name) */
  devtoolsName?: string
  /** Select which parts of state to persist */
  partialize?: (state: T) => Partial<T>
  /** Merge persisted state with initial state */
  merge?: (persistedState: unknown, currentState: T) => T
}

/**
 * Configuration for creating a basic store (no persistence)
 */
export interface BasicStoreConfig {
  /** Devtools name */
  devtoolsName?: string
}

/**
 * Base modal data interface that all modal data types must extend
 */
export interface BaseModalData {
  type: string
}

/**
 * Modal store state
 */
export interface ModalState<TModalData extends BaseModalData> {
  activeModal: string | null
  modalData: TModalData | null
}

/**
 * Modal store actions
 */
export interface ModalActions<TModalData extends BaseModalData> {
  openModal: <T extends TModalData>(modalId: string, data?: T) => void
  closeModal: () => void
}

/**
 * Complete modal store type
 */
export type ModalStore<TModalData extends BaseModalData> = ModalState<TModalData> &
  ModalActions<TModalData>

/**
 * Loading store state
 */
export interface LoadingState {
  isLoading: boolean
  loadingMessage: string | null
}

/**
 * Loading store actions
 */
export interface LoadingActions {
  setLoading: (loading: boolean, message?: string) => void
}

/**
 * Complete loading store type
 */
export type LoadingStore = LoadingState & LoadingActions
