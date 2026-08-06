import type { Action, FiniteStateMachine } from '../../../../../../FSM/src'
import type { BaseEvent } from '../../../BaseEvent'

export class RecordReplayAction implements Action<BaseEvent> {
  execute(event: BaseEvent, _context: FiniteStateMachine<BaseEvent>): void {
    const waterballCommunity = event.getPayload().context
    waterballCommunity.getBroadcast().recordReplay()
  }
}
