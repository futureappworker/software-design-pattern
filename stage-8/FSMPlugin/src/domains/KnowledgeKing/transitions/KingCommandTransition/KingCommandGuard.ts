import type { Guard } from '../../../../../../FSM/src/index'
import type { BaseEvent } from '../../../BaseEvent'
import { KingCommandEvent } from './KingCommandEvent'

export class KingCommandGuard implements Guard<BaseEvent> {
  evaluate(event: BaseEvent): boolean {
    if (!(event instanceof KingCommandEvent)) {
      return false
    }

    const { context, memberId } = event.getPayload()
    const quota = context.getQuota()
    const member = context.getMemberById(memberId)

    if (quota < 5) {
      return false
    }

    if (!member?.isAdmin()) {
      return false
    }

    return true
  }
}
