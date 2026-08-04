import { FiniteStateMachine, type Transition } from '../../../../FSM/src'
import type { BaseEvent } from '../BaseEvent'
import { WaitingState } from './children/WaitingState'

type RecordFSMProps = {
  transitions?: Transition<BaseEvent>[]
  children?: FiniteStateMachine<BaseEvent>[]
  currentChild?: FiniteStateMachine<BaseEvent> | null
}

export class RecordFSM extends FiniteStateMachine<BaseEvent> {
  constructor({ transitions, children, currentChild }: RecordFSMProps) {
    super({
      name: 'RecordFSM',
      parent: null,
      initialState: WaitingState.getInstance(),
      transitions,
      children,
      currentChild,
    })
  }
}
