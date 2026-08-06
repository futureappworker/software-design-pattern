import { Transition } from '../../../../../../FSM/src/index'
import type { BaseEvent } from '../../../BaseEvent'
import { RecordingState } from '../RecordingState'
import { WaitingState } from '../WaitingState'

export class StartBroadcastingTransition extends Transition<BaseEvent> {
  readonly eventType = 'StartBroadcastingEvent'
  readonly guard = null
  readonly from = WaitingState.getInstance()
  readonly to = RecordingState.getInstance()
  readonly actions = []
}
