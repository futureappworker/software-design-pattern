import { Transition } from '../../../../../../FSM/src/index'
import type { BaseEvent } from '../../../BaseEvent'
import { DefaultConversationState } from '../DefaultConversationState'
import { InteractingState } from '../InteractingState'
import { BOnlineMemberCountChangedGuard } from './BOnlineMemberCountChangedGuard'

export class BOnlineMemberCountChangedTransition extends Transition<BaseEvent> {
  readonly eventType = 'OnlineMemberCountChangedEvent'
  readonly guard = new BOnlineMemberCountChangedGuard()
  readonly from = InteractingState.getInstance()
  readonly to = DefaultConversationState.getInstance()
  readonly actions = []
}
