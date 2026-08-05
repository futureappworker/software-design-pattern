import { type FiniteStateMachine, State } from '../../../../FSM/src/index'

import type { BaseEvent } from '../BaseEvent'

import { DefaultConversationState } from './children/DefaultConversationState'
import { InteractingState } from './children/InteractingState'

export class NormalState extends State<BaseEvent> {
  private static instance: NormalState

  private constructor() {
    super()
  }

  static getInstance(): NormalState {
    if (!NormalState.instance) {
      NormalState.instance = new NormalState()
    }

    return NormalState.instance
  }

  enter(event: BaseEvent, context: FiniteStateMachine<BaseEvent>): void {
    const child = context.getChildByName('NormalFSM')

    if (!child) {
      throw new Error('NormalFSM not found')
    }

    context.setCurrentChild(child)

    if (event.getPayload().context.getOnlineMemberCount() < 10) {
      child.changeState(event, DefaultConversationState.getInstance())
    } else {
      child.changeState(event, InteractingState.getInstance())
    }
  }
}
