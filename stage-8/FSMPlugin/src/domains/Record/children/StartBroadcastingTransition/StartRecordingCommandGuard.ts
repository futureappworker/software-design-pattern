import type { Guard } from '../../../../../../FSM/src/index'
import type { BaseEvent } from '../../../BaseEvent'
import { StartBroadcastingEvent } from './StartBroadcastingEvent'

export class StartRecordingCommandGuard implements Guard<BaseEvent> {
  evaluate(event: BaseEvent): boolean {
    if (!(event instanceof StartBroadcastingEvent)) {
      return false
    }

    const { context: waterballCommunity } = event.getPayload()
    // 如果当前有正在广播的 speaker，则返回 false
    if (waterballCommunity.getBroadcast().getSpeakerId() !== null) {
      return false
    }

    return true
  }
}
