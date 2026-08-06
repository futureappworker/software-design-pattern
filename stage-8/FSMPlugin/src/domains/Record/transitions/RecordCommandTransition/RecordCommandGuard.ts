import type { Guard } from '../../../../../../FSM/src/index'
import type { BaseEvent } from '../../../BaseEvent'
import { RecordCommandEvent } from './RecordCommandEvent'

export class RecordCommandGuard implements Guard<BaseEvent> {
  evaluate(event: BaseEvent): boolean {
    if (!(event instanceof RecordCommandEvent)) {
      return false
    }

    const { context } = event.getPayload()
    const quota = context.getQuota()

    if (quota < 3) {
      return false
    }

    return true
  }
}
