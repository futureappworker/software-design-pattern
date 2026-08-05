import { type FiniteStateMachine, State } from '../../../../../FSM/src/index'
import type { BaseEvent } from '../../BaseEvent'
import { MessageReceivedEvent } from '../../MessageReceivedEvent'
import { AllQuestionsAnsweredEvent } from './AllQuestionsAnsweredTransition/AllQuestionsAnsweredEvent'
import { AnswerTimeEndedEvent } from './AnswerTimeEndedTransition/AnswerTimeEndedEvent'
import { AskQuestionEvent } from './events/AskQuestionEvent'

type Question = {
  question: string
  answer: string
}

const question1 = `請問哪個 SQL 語句用於選擇所有的行？
A) SELECT *
B) SELECT ALL
C) SELECT ROWS
D) SELECT DATA
`

const question2 = `請問哪個 CSS 屬性可用於設置文字的顏色？
A) text-align
B) font-size
C) color
D) padding
`

const question3 = `請問在計算機科學中，「XML」代表什麼？
A) Extensible Markup Language
B) Extensible Modeling Language
C) Extended Markup Language
D) Extended Modeling Language
`

const questions: Question[] = [
  {
    question: question1,
    answer: 'A',
  },
  {
    question: question2,
    answer: 'C',
  },
  {
    question: question3,
    answer: 'A',
  },
]

export class QuestioningState extends State<BaseEvent> {
  private static instance: QuestioningState
  private readonly questions = questions
  private currentQuestionIndex: number = 0
  private readonly scores = new Map<string, number>()

  private startedAt: Date | null = null
  private readonly durationSeconds = 60 * 60 // 1 hour
  private timerId: ReturnType<typeof setInterval> | null = null

  private constructor() {
    super()
  }

  static getInstance(): QuestioningState {
    if (!QuestioningState.instance) {
      QuestioningState.instance = new QuestioningState()
    }

    return QuestioningState.instance
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

  private getCurrentQuestion(): Question | null {
    if (this.currentQuestionIndex >= this.questions.length) {
      return null
    }

    return this.questions[this.currentQuestionIndex]
  }

  private advanceToNextQuestion(): void {
    this.currentQuestionIndex++
  }

  private addScore(memberId: string): void {
    const score = this.scores.get(memberId) ?? 0
    this.scores.set(memberId, score + 1)
  }

  private getWinnerMemberId(): string | null {
    let highestScore = -1
    let winners: string[] = []

    for (const [memberId, score] of this.scores) {
      if (score > highestScore) {
        highestScore = score
        winners = [memberId]
        continue
      }

      if (score === highestScore) {
        winners.push(memberId)
      }
    }

    if (winners.length !== 1) {
      return null
    }

    return winners[0]
  }

  private clearScores(): void {
    this.scores.clear()
  }

  private reset() {
    this.stopTimer()

    this.startedAt = null
    this.currentQuestionIndex = 0
    this.clearScores()
  }

  enter(event: BaseEvent, context: FiniteStateMachine<BaseEvent>): void {
    this.reset()
    const onTimeout = () => {
      context.trigger(
        new AnswerTimeEndedEvent({
          context: event.getPayload().context,
        }),
      )
    }
    this.startTimer(onTimeout)
  }

  exit(_event: BaseEvent, _context: FiniteStateMachine<BaseEvent>): void {
    this.reset()
  }

  handleEvent(
    event: BaseEvent,
    context: FiniteStateMachine<BaseEvent>,
  ): boolean {
    if (event instanceof AskQuestionEvent) {
      const currentQuestion = this.getCurrentQuestion()
      if (currentQuestion) {
        const waterballCommunity = event.getPayload().context
        const content = `${this.currentQuestionIndex}. ${currentQuestion.question}`
        // 發送問題到聊天室
        waterballCommunity.sendMessage({
          authorId: waterballCommunity.getBot().getId(),
          content,
          tags: [],
        })
      }
      return true
    }
    if (event instanceof MessageReceivedEvent) {
      const { message } = event.getPayload()
      const tags = message.getTags()
      const botId = event.getPayload().context.getBot().getId()
      // 回答時需標記機器人
      if (!tags.includes(botId)) {
        return true
      }
      const currentQuestion = this.getCurrentQuestion()
      if (currentQuestion) {
        const answer = currentQuestion.answer
        const waterballCommunity = event.getPayload().context
        const botId = waterballCommunity.getBot().getId()
        if (answer === event.getPayload().message.getContent().trim()) {
          // 答對了
          waterballCommunity.sendMessage({
            authorId: botId,
            content: 'Congrats! you got the answer!',
            tags: [message.getAuthorId()],
          })

          // 每一題中的第一位正確答題者會獲得 1 分
          this.addScore(message.getAuthorId())

          // 如果是最後一題，則結束問答
          if (this.currentQuestionIndex === this.questions.length - 1) {
            // 每一題都答完了，就進入感謝參與狀態
            const winnerMemberId: string | null = this.getWinnerMemberId()
            context.trigger(
              new AllQuestionsAnsweredEvent({
                context: event.getPayload().context,
                winnerMemberId,
              }),
            )
            return true
          }

          // 進入下一題
          this.advanceToNextQuestion()
          context.trigger(
            new AskQuestionEvent({
              context: event.getPayload().context,
            }),
          )
        }
        // 靜默忽略錯誤答案
      }
      return true
    }
    return false
  }
}
