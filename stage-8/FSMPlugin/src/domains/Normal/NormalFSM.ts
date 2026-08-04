import { FiniteStateMachine, type Transition } from '../../../../FSM/src'
import type { BaseEvent } from '../BaseEvent'
import { DefaultConversationState } from './children/DefaultConversationState'

type NormalFSMProps = {
  transitions?: Transition<BaseEvent>[]
  children?: FiniteStateMachine<BaseEvent>[]
  currentChild?: FiniteStateMachine<BaseEvent> | null
}

export class NormalFSM extends FiniteStateMachine<BaseEvent> {
  constructor({ transitions, children, currentChild }: NormalFSMProps) {
    super({
      name: 'NormalFSM',
      parent: null,
      initialState: DefaultConversationState.getInstance(),
      transitions,
      children,
      currentChild,
    })
  }
}
