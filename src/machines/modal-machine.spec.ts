import { interpret } from 'xstate'
import { modalMachine } from './modal-machine'

describe('modalMachine', () => {
  const modalService = interpret(modalMachine)

  beforeEach(() => {
    modalService.start()
  })

  afterEach(() => {
    modalService.stop()
  })

  it('should go to the closed state by default', () => {
    expect(modalService.state.matches('hidden')).toBe(true)
  })

  it('should be open after receiving an SHOW event', () => {
    expect(modalService.send('SHOW').matches('displayed')).toBe(true)
  })

  it('should be closed after open and close events', () => {
    expect(modalService.send(['SHOW', 'HIDE']).matches('hidden')).toBe(true)
  })
})
