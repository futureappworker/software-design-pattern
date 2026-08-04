import { Transition } from '../../../../../../FSM/src/index'
import type { BaseEvent } from '../../../BaseEvent'
import { QuestioningState } from '../QuestioningState'
import { ThanksForJoiningState } from '../ThanksForJoiningState'
import { PlayAgainCommandGuard } from './PlayAgainCommandGuard'

export class PlayAgainCommandTransition extends Transition<BaseEvent> {
  readonly eventType = 'PlayAgainCommandEvent'
  readonly guard = new PlayAgainCommandGuard()
  readonly from = ThanksForJoiningState.getInstance()
  readonly to = QuestioningState.getInstance()
  readonly actions = []
}
