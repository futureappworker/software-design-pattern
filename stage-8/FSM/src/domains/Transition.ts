import type { Action } from './Action'
import type { Event } from './Event'
import type { FiniteStateMachine } from './FiniteStateMachine'
import type { Guard } from './Guard'
import type { State } from './State'

export abstract class Transition<TEvent extends Event = Event> {
  abstract readonly eventType: string
  abstract readonly guard: Guard<TEvent> | null
  abstract readonly from: State<TEvent> | null
  abstract readonly to: State<TEvent>
  abstract readonly actions: Action<TEvent>[]

  private transition(event: TEvent, context: FiniteStateMachine<TEvent>): void {
    this.from?.exit(event, context)

    this.actions.forEach((action) => {
      action.execute(event, context)
    })

    this.to.enter(event, context)
  }

  getEventType(): string {
    return this.eventType
  }

  getTo(): State<TEvent> {
    return this.to
  }

  execute(event: TEvent, context: FiniteStateMachine<TEvent>): boolean {
    if (this.guard && !this.guard.evaluate(event)) {
      return false
    }

    this.transition(event, context)

    return true
  }

  matches({
    currentState,
    event,
  }: {
    currentState: State<TEvent>
    event: TEvent
  }): boolean {
    return this.from === currentState && this.eventType === event.eventType
  }
}
