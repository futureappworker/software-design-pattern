import { Transition } from '../../../../../../FSM/src/index'
import type { BaseEvent } from '../../../BaseEvent'
import { NormalState } from '../../NormalState'

export class EnterNormalTransition extends Transition<BaseEvent> {
  readonly eventType = 'EnterNormalEvent'
  readonly guard = null
  readonly from = null
  readonly to = NormalState.getInstance()
  readonly actions = []
}
