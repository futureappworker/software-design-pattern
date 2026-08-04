import { type FiniteStateMachine, State } from '../../../../FSM/src/index'
import type { BaseEvent } from '../BaseEvent'
import { QuestioningState } from './children/QuestioningState'

export class KnowledgeKingState extends State<BaseEvent> {
  private static instance: KnowledgeKingState

  private constructor() {
    super()
  }

  static getInstance(): KnowledgeKingState {
    if (!KnowledgeKingState.instance) {
      KnowledgeKingState.instance = new KnowledgeKingState()
    }

    return KnowledgeKingState.instance
  }

  enter(event: BaseEvent, context: FiniteStateMachine<BaseEvent>): void {
    const child = context.getChildByName('KnowledgeKingFSM')

    if (!child) {
      throw new Error('KnowledgeKing child FSM not found')
    }

    child.changeState(event, QuestioningState.getInstance())
  }
}
