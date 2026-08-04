import { FiniteStateMachine, type Transition } from '../../../FSM/src'
import type { BaseEvent } from './BaseEvent'
import { NormalState } from './Normal/NormalState'

type RootFSMProps = {
  transitions?: Transition<BaseEvent>[]
  children?: FiniteStateMachine<BaseEvent>[]
  currentChild?: FiniteStateMachine<BaseEvent> | null
}

export class RootFSM extends FiniteStateMachine<BaseEvent> {
  constructor({ transitions, children, currentChild }: RootFSMProps) {
    super({
      name: 'RootFSM',
      parent: null,
      initialState: NormalState.getInstance(),
      transitions,
      children,
      currentChild,
    })
  }
}
