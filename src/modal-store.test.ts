import { describe, it, expect } from 'vitest'
import { createModalStore, isModalDataType } from './modal-store'
import { act } from '@testing-library/react'

describe('modal-store', () => {
  type TestModalData =
    | { type: 'confirm'; message: string }
    | { type: 'edit'; itemId: string }
    | { type: 'view'; data: unknown }

  describe('createModalStore', () => {
    it('creates a modal store with null initial state', () => {
      const useModalStore = createModalStore<TestModalData>('test-modals')

      expect(useModalStore.getState().activeModal).toBe(null)
      expect(useModalStore.getState().modalData).toBe(null)
    })

    it('opens modal with data', () => {
      const useModalStore = createModalStore<TestModalData>('test-modals')

      act(() => {
        useModalStore.getState().openModal('confirm', {
          type: 'confirm',
          message: 'Are you sure?',
        })
      })

      expect(useModalStore.getState().activeModal).toBe('confirm')
      expect(useModalStore.getState().modalData).toEqual({
        type: 'confirm',
        message: 'Are you sure?',
      })
    })

    it('opens modal without data', () => {
      const useModalStore = createModalStore<TestModalData>('test-modals')

      act(() => {
        useModalStore.getState().openModal('simple')
      })

      expect(useModalStore.getState().activeModal).toBe('simple')
      expect(useModalStore.getState().modalData).toBe(null)
    })

    it('closes modal and clears data', () => {
      const useModalStore = createModalStore<TestModalData>('test-modals')

      act(() => {
        useModalStore.getState().openModal('confirm', {
          type: 'confirm',
          message: 'Test',
        })
      })

      act(() => {
        useModalStore.getState().closeModal()
      })

      expect(useModalStore.getState().activeModal).toBe(null)
      expect(useModalStore.getState().modalData).toBe(null)
    })

    it('replaces modal when opening a new one', () => {
      const useModalStore = createModalStore<TestModalData>('test-modals')

      act(() => {
        useModalStore.getState().openModal('confirm', {
          type: 'confirm',
          message: 'First',
        })
      })

      act(() => {
        useModalStore.getState().openModal('edit', {
          type: 'edit',
          itemId: '123',
        })
      })

      expect(useModalStore.getState().activeModal).toBe('edit')
      expect(useModalStore.getState().modalData).toEqual({
        type: 'edit',
        itemId: '123',
      })
    })
  })

  describe('isModalDataType', () => {
    it('returns true for matching type', () => {
      const data: TestModalData = { type: 'confirm', message: 'Test' }
      expect(isModalDataType<TestModalData, 'confirm'>(data, 'confirm')).toBe(true)
    })

    it('returns false for non-matching type', () => {
      const data: TestModalData = { type: 'confirm', message: 'Test' }
      expect(isModalDataType<TestModalData, 'edit'>(data, 'edit')).toBe(false)
    })

    it('returns false for null data', () => {
      expect(isModalDataType<TestModalData, 'confirm'>(null, 'confirm')).toBe(false)
    })

    it('narrows type correctly', () => {
      const data: TestModalData | null = { type: 'confirm', message: 'Hello' }

      if (isModalDataType<TestModalData, 'confirm'>(data, 'confirm')) {
        // TypeScript should know data.message exists
        expect(data.message).toBe('Hello')
      }
    })
  })
})
