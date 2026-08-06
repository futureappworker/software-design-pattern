import { Transition } from '../../../../../../FSM/src/index'
import type { BaseEvent } from '../../../BaseEvent'
import { RecordingState } from '../RecordingState'
import { WaitingState } from '../WaitingState'
import { StopRecordingCommandGuard } from './StopBroadcastingGuard'

export class StopBroadcastingTransition extends Transition<BaseEvent> {
  readonly eventType = 'StopBroadcastingEvent'
  readonly guard = new StopRecordingCommandGuard()
  readonly from = RecordingState.getInstance()
  readonly to = WaitingState.getInstance()
  readonly actions = []
}
