import type { Guard } from '../../../../../../FSM/src/index'
import type { BaseEvent } from '../../../BaseEvent'
import { StopRecordingCommandEvent } from './StopRecordingCommandEvent'

export class StopRecordingCommandGuard implements Guard<BaseEvent> {
  evaluate(event: BaseEvent): boolean {
    if (!(event instanceof StopRecordingCommandEvent)) {
      return false
    }

    const { context: waterballCommunity, memberId } = event.getPayload()
    const botId = waterballCommunity.getBot().getId()
    const isBot = memberId === botId
    const speakerId = waterballCommunity.getBroadcast().getSpeakerId()

    if (isBot) {
      return true
    }

    if (memberId !== speakerId) {
      return false
    }

    return true
  }
}
