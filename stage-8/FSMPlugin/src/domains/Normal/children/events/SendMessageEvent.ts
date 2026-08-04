import type { Message } from '../../../../../../WaterballCommunity/src'
import { BaseEvent, type BasePayload } from '../../../BaseEvent'

export type SendMessagePayload = BasePayload & {
  message: Message
}

export class SendMessageEvent extends BaseEvent<SendMessagePayload> {
  readonly eventType = 'SendMessageEvent'
}
