import { type FiniteStateMachine, State } from '../../../../../FSM/src/index'
import type { BaseEvent } from '../../BaseEvent'
import { KnowledgeKingEndedEvent } from '../transitions/KnowledgeKingEndedTransition/KnowledgeKingEndedEvent'
import { AllQuestionsAnsweredEvent } from './AllQuestionsAnsweredTransition/AllQuestionsAnsweredEvent'
import { AnswerTimeEndedEvent } from './AnswerTimeEndedTransition/AnswerTimeEndedEvent'

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

  private announceResult(
    event: AllQuestionsAnsweredEvent | AnswerTimeEndedEvent,
  ): void {
    const { winnerMemberId, context: waterballCommunity } = event.getPayload()
    const botId = waterballCommunity.getBot().getId()
    const content = winnerMemberId ? `The winner is ${winnerMemberId}` : 'Tie!'

    // 若已有人在廣播，改以聊天訊息公布結果
    if (waterballCommunity.hasActiveSpeaker()) {
      waterballCommunity.sendMessage({
        authorId: botId,
        content,
        tags: [],
      })
      return
    }

    waterballCommunity.goBroadcasting({ speakerId: botId })
    waterballCommunity.speak({
      speakerId: botId,
      content,
    })
    waterballCommunity.stopBroadcasting({ speakerId: botId })
  }

  enter(event: BaseEvent, context: FiniteStateMachine<BaseEvent>): void {
    this.reset()

    if (
      event instanceof AllQuestionsAnsweredEvent ||
      event instanceof AnswerTimeEndedEvent
    ) {
      this.announceResult(event)

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
