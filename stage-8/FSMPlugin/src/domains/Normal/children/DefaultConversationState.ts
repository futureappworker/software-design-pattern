import { type FiniteStateMachine, State } from '../../../../../FSM/src/index'
import type { BaseEvent } from '../../BaseEvent'
import { PublishPostEvent } from './events/PublishPostEvent'
import { SendMessageEvent } from './events/SendMessageEvent'

export class DefaultConversationState extends State<BaseEvent> {
  private static instance: DefaultConversationState

  private constructor() {
    super()
  }

  static getInstance(): DefaultConversationState {
    if (!DefaultConversationState.instance) {
      DefaultConversationState.instance = new DefaultConversationState()
    }

    return DefaultConversationState.instance
  }

  enter(event: BaseEvent, _context: FiniteStateMachine<BaseEvent>): void {
    const waterballCommunity = event.getPayload().context
    const bot = waterballCommunity.getBot()
    bot.setResponseMessageIndex(0)
    bot.setResponseMessages(['good to hear', 'thank you', 'How are you'])
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
      // 標記發文者
      const tags = [post.getAuthorId()]
      // 機器人 留言 這個貼文
      context.publishComment({
        postId: post.getId(),
        memberId: bot.getId(),
        content: 'Nice post',
        tags,
      })
      return true
    }

    return false
  }
}
