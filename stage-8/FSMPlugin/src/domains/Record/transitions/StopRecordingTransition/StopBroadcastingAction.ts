import type { Action, FiniteStateMachine } from '../../../../../../FSM/src'
import type { BaseEvent } from '../../../BaseEvent'
import { StopBroadcastingEvent } from '../../children/StopBroadcastingTransition/StopBroadcastingEvent'

export class StopBroadcastingAction implements Action<BaseEvent> {
  execute(event: BaseEvent, context: FiniteStateMachine<BaseEvent>): void {
    context.trigger(
      new StopBroadcastingEvent({
        context: event.getPayload().context,
      }),
    )
  }
}
