import type { Event } from './Event'
import type { FiniteStateMachine } from './FiniteStateMachine'

export abstract class State<TEvent extends Event> {
  enter(_event: TEvent, _context: FiniteStateMachine<TEvent>): void {
    // hook
  }

  exit(_event: TEvent, _context: FiniteStateMachine<TEvent>): void {
    // hook
  }

  handleEvent(_event: TEvent, _context: FiniteStateMachine<TEvent>): boolean {
    return false
  }
}
