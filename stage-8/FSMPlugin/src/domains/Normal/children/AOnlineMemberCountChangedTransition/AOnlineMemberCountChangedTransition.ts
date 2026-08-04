import { Transition } from '../../../../../../FSM/src/index'
import type { BaseEvent } from '../../../BaseEvent'
import { DefaultConversationState } from '../DefaultConversationState'
import { InteractingState } from '../InteractingState'
import { AOnlineMemberCountChangedGuard } from './AOnlineMemberCountChangedGuard'

export class AOnlineMemberCountChangedTransition extends Transition<BaseEvent> {
  readonly eventType = 'OnlineMemberCountChangedEvent'
  readonly guard = new AOnlineMemberCountChangedGuard()
  readonly from = DefaultConversationState.getInstance()
  readonly to = InteractingState.getInstance()
  readonly actions = []
}
