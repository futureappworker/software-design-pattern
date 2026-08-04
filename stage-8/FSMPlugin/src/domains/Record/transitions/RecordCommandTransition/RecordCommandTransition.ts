import { Transition } from '../../../../../../FSM/src/index'
import type { BaseEvent } from '../../../BaseEvent'
import { NormalState } from '../../../Normal/NormalState'
import { RecordState } from '../../RecordState'
import { RecordCommandConsumeQuotaAction } from './RecordCommandConsumeQuotaAction'
import { RecordCommandGuard } from './RecordCommandGuard'

export class RecordCommandTransition extends Transition<BaseEvent> {
  readonly eventType = 'RecordCommandEvent'
  readonly guard = new RecordCommandGuard()
  readonly from = NormalState.getInstance()
  readonly to = RecordState.getInstance()
  readonly actions = [new RecordCommandConsumeQuotaAction()]
}
