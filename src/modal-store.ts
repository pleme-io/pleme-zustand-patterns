/**
 * Modal Store Pattern
 *
 * Type-safe modal state management with discriminated unions.
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { StoreApi, UseBoundStore } from 'zustand'
import type { BaseModalData, ModalStore, ModalState, ModalActions } from './types'

const initialModalState: ModalState<BaseModalData> = {
  activeModal: null,
  modalData: null,
}

/**
 * Create a type-safe modal store with discriminated union data.
 *
 * @example
 * ```ts
 * // Define your modal data types
 * type ModalData =
 *   | { type: 'confirm-delete'; itemId: string; itemName: string }
 *   | { type: 'edit-user'; userId: string }
 *   | { type: 'view-details'; details: unknown }
 *
 * // Create the store
 * const useModalStore = createModalStore<ModalData>('app-modals')
 *
 * // Use in components
 * const { openModal, closeModal, activeModal, modalData } = useModalStore()
 *
 * // Open with type-safe data
 * openModal('confirm-delete', { type: 'confirm-delete', itemId: '123', itemName: 'Test' })
 *
 * // Type guard for narrowing
 * if (isModalDataType(modalData, 'confirm-delete')) {
 *   console.log(modalData.itemId) // TypeScript knows this is ConfirmDeleteModalData
 * }
 * ```
 */
export function createModalStore<TModalData extends BaseModalData>(
  devtoolsName = 'modal-store'
): UseBoundStore<StoreApi<ModalStore<TModalData>>> {
  return create<ModalStore<TModalData>>()(
    devtools(
      immer((set) => ({
        activeModal: null,
        modalData: null,

        openModal: <T extends TModalData>(modalId: string, data?: T) => {
          set((state) => {
            state.activeModal = modalId
            state.modalData = (data ?? null) as TModalData | null
          })
        },

        closeModal: () => {
          set((state) => {
            state.activeModal = null
            state.modalData = null
          })
        },
      })),
      { name: devtoolsName }
    )
  )
}

/**
 * Type guard for modal data types.
 * Use in components to narrow the modal data type.
 *
 * @example
 * ```tsx
 * const modalData = useModalData()
 *
 * if (isModalDataType(modalData, 'confirm-delete')) {
 *   // modalData is now typed as { type: 'confirm-delete'; itemId: string; ... }
 *   console.log(modalData.itemId)
 * }
 * ```
 */
export function isModalDataType<
  TModalData extends BaseModalData,
  T extends TModalData['type']
>(
  data: TModalData | null,
  type: T
): data is Extract<TModalData, { type: T }> {
  return data !== null && data.type === type
}
