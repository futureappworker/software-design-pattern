import type { Event } from './Event'
import type { FiniteStateMachine } from './FiniteStateMachine'

export interface Action<TEvent extends Event = Event> {
  execute(event: TEvent, _context: FiniteStateMachine<TEvent>): void
}
