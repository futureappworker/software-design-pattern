import type { Guard } from '../../../../../../FSM/src/index'
import type { BaseEvent } from '../../../BaseEvent'
import { StopRecordingEvent } from './StopRecordingEvent'

export class StopRecordingGuard implements Guard<BaseEvent> {
  evaluate(event: BaseEvent): boolean {
    if (!(event instanceof StopRecordingEvent)) {
      return false
    }

    const { context: waterballCommunity, memberId } = event.getPayload()
    const speaker = waterballCommunity.getBroadcast().getSpeaker()

    if (!speaker) {
      return false
    }

    return speaker.getId() === memberId
  }
}
