import type { Guard } from '../../../../../../FSM/src/index'
import type { BaseEvent } from '../../../BaseEvent'
import { OnlineMemberCountChangedEvent } from '../AOnlineMemberCountChangedTransition/OnlineMemberCountChangedEvent'

export class BOnlineMemberCountChangedGuard implements Guard<BaseEvent> {
  evaluate(event: BaseEvent): boolean {
    if (!(event instanceof OnlineMemberCountChangedEvent)) {
      return false
    }

    const { context } = event.getPayload()
    const count = context.getOnlineMemberCount()

    if (count >= 10) {
      return false
    }

    return true
  }
}
