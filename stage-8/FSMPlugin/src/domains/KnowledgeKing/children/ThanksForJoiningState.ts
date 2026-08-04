import { State } from '../../../../../FSM/src/index'
import type { BaseEvent } from '../../BaseEvent'

export class ThanksForJoiningState extends State<BaseEvent> {
  private static instance: ThanksForJoiningState

  private constructor() {
    super()
  }

  static getInstance(): ThanksForJoiningState {
    if (!ThanksForJoiningState.instance) {
      ThanksForJoiningState.instance = new ThanksForJoiningState()
    }

    return ThanksForJoiningState.instance
  }
}
