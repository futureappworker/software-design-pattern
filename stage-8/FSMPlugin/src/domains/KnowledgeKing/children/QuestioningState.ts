import { State } from '../../../../../FSM/src/index'
import type { BaseEvent } from '../../BaseEvent'

export class QuestioningState extends State<BaseEvent> {
  private static instance: QuestioningState

  private constructor() {
    super()
  }

  static getInstance(): QuestioningState {
    if (!QuestioningState.instance) {
      QuestioningState.instance = new QuestioningState()
    }

    return QuestioningState.instance
  }
}
