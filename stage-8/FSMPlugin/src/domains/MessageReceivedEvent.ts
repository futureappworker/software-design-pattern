import type { Message } from '../../../WaterballCommunity/src'
import { BaseEvent, type BasePayload } from './BaseEvent'

export type MessageReceivedEventPayload = BasePayload & {
  message: Message
}

export class MessageReceivedEvent extends BaseEvent<MessageReceivedEventPayload> {
  readonly eventType = 'MessageReceivedEvent'
}
