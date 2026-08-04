import { Event } from '../../../FSM/src/index'
import type { WaterballCommunity } from '../../../WaterballCommunity/src'

export type BasePayload = {
  context: WaterballCommunity
}

export abstract class BaseEvent<
  TPayload extends BasePayload = BasePayload,
> extends Event<TPayload> {}
