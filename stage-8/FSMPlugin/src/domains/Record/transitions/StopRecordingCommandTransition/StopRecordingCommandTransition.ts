import { Transition } from '../../../../../../FSM/src/index'
import type { BaseEvent } from '../../../BaseEvent'
import { NormalState } from '../../../Normal/NormalState'
import { RecordState } from '../../RecordState'
import { StopRecordingCommandGuard } from './StopRecordingCommandGuard'

export class StopRecordingCommandTransition extends Transition<BaseEvent> {
  readonly eventType = 'StopRecordingCommandEvent'
  readonly guard = new StopRecordingCommandGuard()
  readonly from = RecordState.getInstance()
  readonly to = NormalState.getInstance()
  readonly actions = []
}
