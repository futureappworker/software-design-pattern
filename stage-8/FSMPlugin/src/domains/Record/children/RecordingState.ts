import { State } from '../../../../../FSM/src/index'
import type { BaseEvent } from '../../BaseEvent'

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
}
