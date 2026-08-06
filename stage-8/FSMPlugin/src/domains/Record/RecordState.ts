import { type FiniteStateMachine, State } from '../../../../FSM/src/index'

import type { BaseEvent } from '../BaseEvent'
import { RecordingState } from './children/RecordingState'
import { WaitingState } from './children/WaitingState'
import { RecordCommandEvent } from './transitions/RecordCommandTransition/RecordCommandEvent'
import { StopRecordingCommandEvent } from './transitions/StopRecordingCommandTransition/StopRecordingCommandEvent'

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

    context.setCurrentChild(child)

    const waterballCommunity = event.getPayload().context
    const hasActiveSpeaker = waterballCommunity.hasActiveSpeaker()
    if (event instanceof RecordCommandEvent) {
      waterballCommunity
        .getBroadcast()
        .setRecorderId(event.getPayload().memberId)
    }
    waterballCommunity.getBroadcast().setIsRecording(true)
    if (!hasActiveSpeaker) {
      child.changeState(event, WaitingState.getInstance())
    } else {
      child.changeState(event, RecordingState.getInstance())
    }
  }

  exit(event: BaseEvent, _context: FiniteStateMachine<BaseEvent>): void {
    if (event instanceof StopRecordingCommandEvent) {
      const waterballCommunity = event.getPayload().context
      waterballCommunity.getBroadcast().setIsRecording(false)
      waterballCommunity.getBroadcast().recordReplay()
    }
  }
}
