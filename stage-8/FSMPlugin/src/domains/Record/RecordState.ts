import { type FiniteStateMachine, State } from '../../../../FSM/src/index'

import type { BaseEvent } from '../BaseEvent'
import { RecordingState } from './children/RecordingState'
import { WaitingState } from './children/WaitingState'
import { RecordCommandEvent } from './transitions/RecordCommandTransition/RecordCommandEvent'

export class RecordState extends State<BaseEvent> {
  private static instance: RecordState

  private constructor() {
    super()
  }

  static getInstance(): RecordState {
    if (!RecordState.instance) {
      RecordState.instance = new RecordState()
    }

    return RecordState.instance
  }

  enter(event: BaseEvent, context: FiniteStateMachine<BaseEvent>): void {
    const child = context.getChildByName('RecordFSM')

    if (!child) {
      throw new Error('NormalFSM not found')
    }

    if (event instanceof RecordCommandEvent) {
      const waterballCommunity = event.getPayload().context
      if (waterballCommunity.hasActiveSpeaker()) {
        child.changeState(event, RecordingState.getInstance())
      } else {
        child.changeState(event, WaitingState.getInstance())
      }
    }
  }
}
