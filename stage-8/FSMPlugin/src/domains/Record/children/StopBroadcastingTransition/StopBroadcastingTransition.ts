import { Transition } from '../../../../../../FSM/src/index'
import type { BaseEvent } from '../../../BaseEvent'
import { WaitingState } from '../WaitingState'

export class StopBroadcastingTransition extends Transition<BaseEvent> {
  readonly eventType = 'StopBroadcastingEvent'
  readonly guard = null
  readonly from = null
  readonly to = WaitingState.getInstance()
  readonly actions = []
}
