import type { Guard } from '../../../../../../FSM/src/index'
import type { BaseEvent } from '../../../BaseEvent'
import { KingStopCommandEvent } from './KingStopCommandEvent'

export class KingStopCommandGuard implements Guard<BaseEvent> {
  evaluate(event: BaseEvent): boolean {
    if (!(event instanceof KingStopCommandEvent)) {
      return false
    }

    const { context, memberId } = event.getPayload()

    const member = context.getMemberById(memberId)

    if (!member?.isAdmin()) {
      return false
    }

    return true
  }
}
