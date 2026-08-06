import type { Guard } from '../../../../../../FSM/src/index'
import type { BaseEvent } from '../../../BaseEvent'
import { StopBroadcastingEvent } from './StopBroadcastingEvent'

export class StopRecordingCommandGuard implements Guard<BaseEvent> {
  evaluate(event: BaseEvent): boolean {
    if (!(event instanceof StopBroadcastingEvent)) {
      return false
    }

    const { context: waterballCommunity, speakerId } = event.getPayload()

    // 如果 speakerId 不是当前正在广播的 speakerId，则返回 false
    if (speakerId !== waterballCommunity.getBroadcast().getSpeakerId()) {
      return false
    }

    return true
  }
}
