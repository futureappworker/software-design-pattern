import { State } from '../../../../../FSM/src/index'
import type { BaseEvent } from '../../BaseEvent'

export class WaitingState extends State<BaseEvent> {
  private static instance: WaitingState

  private constructor() {
    super()
  }

  static getInstance(): WaitingState {
    if (!WaitingState.instance) {
      WaitingState.instance = new WaitingState()
    }

    return WaitingState.instance
  }
}
