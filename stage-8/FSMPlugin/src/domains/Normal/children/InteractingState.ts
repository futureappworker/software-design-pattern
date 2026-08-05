import { type FiniteStateMachine, State } from '../../../../../FSM/src/index'
import type { BaseEvent } from '../../BaseEvent'
import { PublishPostEvent } from './events/PublishPostEvent'
import { SendMessageEvent } from './events/SendMessageEvent'

export class InteractingState extends State<BaseEvent> {
  private static instance: InteractingState

  private constructor() {
    super()
  }

  static getInstance(): InteractingState {
    if (!InteractingState.instance) {
      InteractingState.instance = new InteractingState()
    }

    return InteractingState.instance
  }

  enter(event: BaseEvent, _context: FiniteStateMachine<BaseEvent>): void {
    const waterballCommunity = event.getPayload().context
    const bot = waterballCommunity.getBot()
    bot.setResponseMessageIndex(0)
    bot.setResponseMessages(['Hi hi😁', 'I like your idea!'])
  }

  handleEvent(
    event: BaseEvent,
    _context: FiniteStateMachine<BaseEvent>,
  ): boolean {
    if (event instanceof SendMessageEvent) {
      const { message, context } = event.getPayload()
      const bot = context.getBot()
      // 機器人，回應訊息給發文者
      context.sendMessage({
        authorId: bot.getId(),
        content: bot.getResponseMessage(),
        tags: [message.getAuthorId()],
      })
      return true
    }

    if (event instanceof PublishPostEvent) {
      const { post, context } = event.getPayload()
      const bot = context.getBot()
      // 標記所有在線上的成員
      const tags: string[] = context.getMemberIdsSortedByLoginTime()
      // 機器人 留言 這個貼文
      context.publishComment({
        postId: post.getId(),
        memberId: bot.getId(),
        content: 'How do you guys think about it?',
        tags,
      })
      return true
    }

    return false
  }
}
