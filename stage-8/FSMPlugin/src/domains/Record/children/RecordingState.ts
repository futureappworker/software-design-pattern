import { FiniteStateMachine, State } from '../../../../../FSM/src/index'
import type { BaseEvent } from '../../BaseEvent'
import { StartBroadcastingEvent } from './StartBroadcastingTransition/StartBroadcastingEvent'
import { StopBroadcastingEvent } from './StopBroadcastingTransition/StopBroadcastingEvent'

export class RecordingState extends State<BaseEvent> {
  private static instance: RecordingState

  private constructor() {
    super()
  }

  static getInstance(): RecordingState {
    if (!RecordingState.instance) {
      RecordingState.instance = new RecordingState()
    }

    return RecordingState.instance
  }

  enter(event: BaseEvent, _context: FiniteStateMachine<BaseEvent>): void {
    if (event instanceof StartBroadcastingEvent) {
      const waterballCommunity = event.getPayload().context
      waterballCommunity.getBroadcast().setIsRecording(true)
    }
  }

  exit(event: BaseEvent, _context: FiniteStateMachine<BaseEvent>): void {
    if (event instanceof StopBroadcastingEvent) {
      const waterballCommunity = event.getPayload().context
      waterballCommunity.getBroadcast().setIsRecording(false)
    }
  }
}
