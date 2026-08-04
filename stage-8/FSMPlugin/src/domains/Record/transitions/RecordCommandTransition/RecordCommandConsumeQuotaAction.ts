import type { Action } from '../../../../../../FSM/src'
import type { BaseEvent } from '../../../BaseEvent'
import { RecordCommandEvent } from './RecordCommandEvent'

export class RecordCommandConsumeQuotaAction implements Action<BaseEvent> {
  execute(event: BaseEvent): void {
    if (event instanceof RecordCommandEvent) {
      // 扣 3 Quota
      const { context } = event.getPayload()
      context.consumeQuota(3)
    }
  }
}
