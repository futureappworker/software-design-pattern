import type { Guard } from '../../../../../../FSM/src/index'
import type { BaseEvent } from '../../../BaseEvent'
import { PlayAgainCommandEvent } from './PlayAgainCommandEvent'

export class PlayAgainCommandGuard implements Guard<BaseEvent> {
  evaluate(event: BaseEvent): boolean {
    if (!(event instanceof PlayAgainCommandEvent)) {
      return false
    }

    const { context } = event.getPayload()
    const quota = context.getQuota()

    if (quota < 5) {
      return false
    }

    return true
  }
}
