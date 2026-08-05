import { type FiniteStateMachine, State } from '../../../../../FSM/src/index'
import type { BaseEvent } from '../../BaseEvent'
import { KnowledgeKingEndedEvent } from '../transitions/KnowledgeKingEndedTransition/KnowledgeKingEndedEvent'
import { AllQuestionsAnsweredEvent } from './AllQuestionsAnsweredTransition/AllQuestionsAnsweredEvent'

export class ThanksForJoiningState extends State<BaseEvent> {
  private static instance: ThanksForJoiningState

  private startedAt: Date | null = null
  private readonly durationSeconds = 20 // 20 seconds
  private timerId: ReturnType<typeof setInterval> | null = null

  private constructor() {
    super()
  }

  static getInstance(): ThanksForJoiningState {
    if (!ThanksForJoiningState.instance) {
      ThanksForJoiningState.instance = new ThanksForJoiningState()
    }

    return ThanksForJoiningState.instance
  }

  private isTimeUp(): boolean {
    if (!this.startedAt) {
      return false
    }

    const elapsedSeconds = Math.floor(
      (Date.now() - this.startedAt.getTime()) / 1000,
    )

    return elapsedSeconds >= this.durationSeconds
  }

  private startTimer(onTimeout: () => void): void {
    this.stopTimer()

    this.startedAt = new Date()

    this.timerId = setInterval(() => {
      if (this.isTimeUp()) {
        this.stopTimer()
        onTimeout()
      }
    }, 1000)
  }

  private stopTimer(): void {
    if (!this.timerId) {
      return
    }

    clearInterval(this.timerId)
    this.timerId = null
  }

  private reset() {
    this.stopTimer()
    this.startedAt = null
  }

  enter(event: BaseEvent, context: FiniteStateMachine<BaseEvent>): void {
    this.reset()
    if (event instanceof AllQuestionsAnsweredEvent) {
      const { winnerMemberId } = event.getPayload()

      const waterballCommunity = event.getPayload().context
      const botId = waterballCommunity.getBot().getId()

      waterballCommunity.sendMessage({
        authorId: botId,
        content: 'record',
        tags: [],
      })

      if (winnerMemberId) {
        waterballCommunity.speak({
          speakerId: botId,
          content: `The winner is ${winnerMemberId}`,
        })
      }
      if (!winnerMemberId) {
        waterballCommunity.speak({
          speakerId: botId,
          content: 'Tie!',
        })
      }

      waterballCommunity.sendMessage({
        authorId: botId,
        content: 'stop-recording',
        tags: [],
      })

      const onTimeout = () => {
        context.trigger(
          new KnowledgeKingEndedEvent({
            context: event.getPayload().context,
          }),
        )
      }
      this.startTimer(onTimeout)
    }
  }

  exit(_event: BaseEvent, _context: FiniteStateMachine<BaseEvent>): void {
    this.reset()
  }
}
