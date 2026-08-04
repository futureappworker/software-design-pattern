import { Transition } from '../../../../../../FSM/src/index'
import type { BaseEvent } from '../../../BaseEvent'
import { QuestioningState } from '../QuestioningState'
import { ThanksForJoiningState } from '../ThanksForJoiningState'

export class AnswerTimeEndedTransition extends Transition<BaseEvent> {
  readonly eventType = 'AnswerTimeEndedEvent'
  readonly guard = null
  readonly from = QuestioningState.getInstance()
  readonly to = ThanksForJoiningState.getInstance()
  readonly actions = []
}
