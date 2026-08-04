import type { Event } from './Event'

export interface Guard<TEvent extends Event = Event> {
  evaluate(event: TEvent): boolean
}
