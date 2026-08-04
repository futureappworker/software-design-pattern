import type { Action } from '../../../../../../FSM/src'
import type { BaseEvent } from '../../../BaseEvent'
import { KingCommandEvent } from './KingCommandEvent'

export class KingCommandConsumeQuotaAction implements Action<BaseEvent> {
  execute(event: BaseEvent): void {
    if (event instanceof KingCommandEvent) {
      // 扣 5 Quota
      const { context } = event.getPayload()
      context.consumeQuota(5)
    }
  }
}
