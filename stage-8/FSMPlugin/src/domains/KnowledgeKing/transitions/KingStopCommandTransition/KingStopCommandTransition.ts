import { Transition } from '../../../../../../FSM/src/index'
import type { BaseEvent } from '../../../BaseEvent'
import { NormalState } from '../../../Normal/NormalState'
import { KnowledgeKingState } from '../../KnowledgeKingState'
import { KingStopCommandGuard } from './KingStopCommandGuard'

export class KingStopCommandTransition extends Transition<BaseEvent> {
  readonly eventType = 'KingStopCommandEvent'
  readonly guard = new KingStopCommandGuard()
  readonly from = KnowledgeKingState.getInstance()
  readonly to = NormalState.getInstance()
  readonly actions = []
}
