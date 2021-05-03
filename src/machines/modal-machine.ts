import { Machine } from 'xstate'

export interface ModalSchema {
  states: {
    displayed: Record<string, unknown>
    hidden: Record<string, unknown>
  }
}

export type ModalEvent = { type: 'SHOW' } | { type: 'HIDE' }

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ModalContext {}

export const modalMachine = Machine<ModalContext, ModalSchema, ModalEvent>({
  id: 'modal',
  initial: 'hidden',
  context: {},
  states: {
    displayed: {
      on: {
        HIDE: 'hidden',
      },
    },
    hidden: {
      on: {
        SHOW: 'displayed',
      },
    },
  },
})
