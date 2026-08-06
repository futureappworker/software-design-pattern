import { Transition } from '../../../../../../FSM/src/index'
import type { BaseEvent } from '../../../BaseEvent'
import { RecordingState } from '../RecordingState'
import { WaitingState } from '../WaitingState'
import { StartRecordingCommandGuard } from './StartRecordingCommandGuard'

export class StartBroadcastingTransition extends Transition<BaseEvent> {
  readonly eventType = 'StartBroadcastingEvent'
  readonly guard = new StartRecordingCommandGuard()
  readonly from = WaitingState.getInstance()
  readonly to = RecordingState.getInstance()
  readonly actions = []
}
