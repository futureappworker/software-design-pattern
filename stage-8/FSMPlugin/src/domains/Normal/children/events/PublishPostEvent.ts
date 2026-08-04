import type { Post } from '../../../../../../WaterballCommunity/src'
import { BaseEvent, type BasePayload } from '../../../BaseEvent'

export type PublishPostPayload = BasePayload & {
  post: Post
}

export class PublishPostEvent extends BaseEvent<PublishPostPayload> {
  readonly eventType = 'PublishPostEvent'
}
