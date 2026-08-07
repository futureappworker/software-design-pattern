import type { Guard } from '../../../../../../FSM/src/index'
import type { BaseEvent } from '../../../BaseEvent'
import { StartBroadcastingEvent } from './StartBroadcastingEvent'

export class StartRecordingCommandGuard implements Guard<BaseEvent> {
  evaluate(event: BaseEvent): boolean {
    if (!(event instanceof StartBroadcastingEvent)) {
      return false
    }

    const { context: waterballCommunity } = event.getPayload()
    // goBroadcasting 會先設 speaker 再觸發事件；有講者才進入 Recording
    if (waterballCommunity.getBroadcast().getSpeakerId() === null) {
      return false
    }

    return true
  }
}
