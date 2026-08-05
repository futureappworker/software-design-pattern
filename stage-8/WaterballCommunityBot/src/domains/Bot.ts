import type { FiniteStateMachine } from '../../../FSM/src'
import {
  AskQuestionEvent,
  KingCommandEvent,
  KingStopCommandEvent,
  MessageReceivedEvent,
  PlayAgainCommandEvent,
  RecordCommandEvent,
  StopRecordingEvent,
} from '../../../FSMPlugin/events'
import type { BaseEvent } from '../../../FSMPlugin/src/domains/BaseEvent'
import type {
  Message,
  WaterballCommunity,
} from '../../../WaterballCommunity/src'

type BotProps = {
  id?: string
  finiteStateMachine: FiniteStateMachine<BaseEvent>
}

export class Bot {
  private id: string = 'bot'
  private finiteStateMachine!: FiniteStateMachine<BaseEvent>
  private responseMessages: string[] = []
  private responseMessageIndex = 0

  constructor({ id = 'bot', finiteStateMachine }: BotProps) {
    this.setId(id)
    this.setFiniteStateMachine(finiteStateMachine)
  }

  getId(): string {
    return this.id
  }

  setId(id: string): void {
    this.id = id
  }

  setResponseMessageIndex(index: number): void {
    this.responseMessageIndex = index
  }

  setResponseMessages(messages: string[]): void {
    this.responseMessages = [...messages]
  }

  getFiniteStateMachine(): FiniteStateMachine<BaseEvent> {
    return this.finiteStateMachine
  }

  private setFiniteStateMachine(
    finiteStateMachine: FiniteStateMachine<BaseEvent>,
  ): void {
    this.finiteStateMachine = finiteStateMachine
  }

  getResponseMessage(): string {
    if (this.responseMessageIndex >= this.responseMessages.length) {
      this.responseMessageIndex = 0
    }
    const message = this.responseMessages[this.responseMessageIndex]
    this.responseMessageIndex++
    return message
  }

  handleMessage(context: WaterballCommunity, message: Message): void {
    let isHandled = false
    const tags = message.getTags()
    // 若是 會員 的 message，要 tag 機器人的，才處理
    if (
      message.getAuthorId() !== context.getBot().getId() &&
      !tags.includes('bot')
    ) {
      return
    }
    switch (message.getContent()) {
      case 'king':
        isHandled = this.getFiniteStateMachine().trigger(
          new KingCommandEvent({
            context,
            memberId: message.getAuthorId(),
          }),
        )
        if (isHandled) {
          context.sendMessage({
            authorId: context.getBot().getId(),
            content: 'KnowledgeKing is started!',
            tags: [],
          })
          this.getFiniteStateMachine().trigger(
            new AskQuestionEvent({
              context,
            }),
          )
          return
        }
        break
      case 'record':
        isHandled = this.getFiniteStateMachine().trigger(
          new RecordCommandEvent({
            context,
            memberId: message.getAuthorId(),
          }),
        )
        if (isHandled) {
          if (message.getAuthorId() === context.getBot().getId()) {
            console.log('🤖 go broadcasting...')
          } else {
            console.log(`📢 ${message.getAuthorId()} is broadcasting...`)
          }
          return
        }
        break
      case 'stop-recording':
        isHandled = this.getFiniteStateMachine().trigger(
          new StopRecordingEvent({
            context,
            memberId: message.getAuthorId(),
          }),
        )
        if (isHandled) {
          context.getBroadcast().recordReplay(context)

          if (message.getAuthorId() === context.getBot().getId()) {
            console.log('🤖 stop broadcasting...')
          } else {
            console.log(`📢 ${message.getAuthorId()} stop broadcasting`)
          }
          return
        }
        break
      case 'king-stop':
        isHandled = this.getFiniteStateMachine().trigger(
          new KingStopCommandEvent({
            context,
            memberId: message.getAuthorId(),
          }),
        )
        if (isHandled) return
        break
      case 'play again':
        isHandled = this.getFiniteStateMachine().trigger(
          new PlayAgainCommandEvent({
            context,
          }),
        )
        if (isHandled) {
          context.sendMessage({
            authorId: context.getBot().getId(),
            content: 'KnowledgeKing is gonna start again!',
            tags: [],
          })
          return
        }
        break
      default:
        break
    }

    this.getFiniteStateMachine().trigger(
      new MessageReceivedEvent({
        context,
        message,
      }),
    )
  }
}
