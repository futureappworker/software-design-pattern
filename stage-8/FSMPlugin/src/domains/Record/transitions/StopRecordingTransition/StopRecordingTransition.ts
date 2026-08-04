import { Transition } from '../../../../../../FSM/src/index'
import type { BaseEvent } from '../../../BaseEvent'
import { NormalState } from '../../../Normal/NormalState'
import { RecordState } from '../../RecordState'

export class StopRecordingTransition extends Transition<BaseEvent> {
  readonly eventType = 'StopRecordingEvent'
  readonly guard = null
  readonly from = RecordState.getInstance()
  readonly to = NormalState.getInstance()
  readonly actions = []
}
