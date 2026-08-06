import { Transition } from '../../../../../../FSM/src/index'
import type { BaseEvent } from '../../../BaseEvent'
import { RecordingState } from '../RecordingState'
import { WaitingState } from '../WaitingState'
import { RecordReplayAction } from './recordReplayAction'

export class StopBroadcastingTransition extends Transition<BaseEvent> {
  readonly eventType = 'StopBroadcastingEvent'
  readonly guard = null
  readonly from = RecordingState.getInstance()
  readonly to = WaitingState.getInstance()
  readonly actions = [new RecordReplayAction()]
}
