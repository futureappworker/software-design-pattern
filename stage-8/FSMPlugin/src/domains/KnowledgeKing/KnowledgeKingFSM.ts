import { FiniteStateMachine, type Transition } from '../../../../FSM/src'
import type { BaseEvent } from '../BaseEvent'
import { QuestioningState } from './children/QuestioningState'

type KnowledgeKingFSMProps = {
  transitions?: Transition<BaseEvent>[]
  children?: FiniteStateMachine<BaseEvent>[]
  currentChild?: FiniteStateMachine<BaseEvent> | null
}

export class KnowledgeKingFSM extends FiniteStateMachine<BaseEvent> {
  constructor({ transitions, children, currentChild }: KnowledgeKingFSMProps) {
    super({
      name: 'KnowledgeKingFSM',
      parent: null,
      initialState: QuestioningState.getInstance(),
      transitions,
      children,
      currentChild,
    })
  }
}
