import {
  EnterNormalEvent,
  OnlineMemberCountChangedEvent,
  PublishPostEvent,
  StartBroadcastingEvent,
  StopBroadcastingEvent,
} from '../../../FSMPlugin/events'
import type {
  BaseEvent,
  BasePayload,
} from '../../../FSMPlugin/src/domains/BaseEvent'
import { SendMessageEvent } from '../../../FSMPlugin/src/domains/Normal/children/events/SendMessageEvent'
import type { Bot } from '../../../WaterballCommunityBot/src/index'
import { Broadcast } from './Broadcast'
import { ChatRoom } from './ChatRoom'
import { Comment } from './Comment'
import { Forum } from './Forum'
import type { Member } from './Member'
import { Message } from './Message'
import { Post } from './Post'

type WaterballCommunityProps = {
  bot: Bot
  quota?: number
  members?: Member[]
}

export class WaterballCommunity {
  private bot!: Bot
  private forum: Forum = new Forum({})
  private chatRoom: ChatRoom = new ChatRoom({})
  private broadcast: Broadcast = new Broadcast({})
  private quota: number = 0
  private members: Member[] = []

  constructor({ bot, quota = 0, members = [] }: WaterballCommunityProps) {
    this.setBot(bot)
    this.setQuota(quota)
    this.setMembers(members)
  }

  getBot(): Bot {
    return this.bot
  }

  setBot(bot: Bot): void {
    this.bot = bot
  }

  getForum(): Forum {
    return this.forum
  }

  setForum(forum: Forum): void {
    this.forum = forum
  }

  getChatRoom(): ChatRoom {
    return this.chatRoom
  }

  setChatRoom(chatRoom: ChatRoom): void {
    this.chatRoom = chatRoom
  }

  getBroadcast(): Broadcast {
    return this.broadcast
  }

  setBroadcast(broadcast: Broadcast): void {
    this.broadcast = broadcast
  }

  getQuota(): number {
    return this.quota
  }

  private setQuota(quota: number): void {
    this.quota = quota
  }

  consumeQuota(quota: number): void {
    if (this.getQuota() - quota < 0) {
      throw new Error('Quota not enough')
    }
    this.setQuota(this.getQuota() - quota)
  }

  getMembers(): Member[] {
    return [...this.members]
  }

  getOnlineMemberCount(): number {
    let count = this.members.filter((m) => m.getIsOnline()).length
    if (this.getBot()) {
      count++
    }
    return count
  }

  setMembers(members: Member[]): void {
    this.members = [...members]
  }

  getMemberById(id: string): Member | undefined {
    return this.members.find((m) => m.getId() === id)
  }

  addMember(member: Member): void {
    this.members.push(member)
  }

  hasActiveSpeaker(): boolean {
    return this.broadcast.getSpeakerId() !== null
  }

  triggerEvent(event: BaseEvent<BasePayload>): void {
    this.getBot().getFiniteStateMachine().trigger(event)
  }

  handleEnterNormalEvent() {
    this.triggerEvent(
      new EnterNormalEvent({
        context: this,
      }),
    )
  }

  login(memberId: string): void {
    const member = this.getMemberById(memberId)
    if (!member) {
      throw new Error('Member not found')
    }
    member.login()
    this.triggerEvent(
      new OnlineMemberCountChangedEvent({
        context: this,
      }),
    )
  }

  logout(memberId: string): void {
    const member = this.getMemberById(memberId)
    if (!member) {
      throw new Error('Member not found')
    }
    member.logout()
    this.triggerEvent(
      new OnlineMemberCountChangedEvent({
        context: this,
      }),
    )
  }

  getMemberIdsSortedByLoginTime(): string[] {
    const ids = this.members
      .toSorted((a, b) => {
        const aLoginTime = a.getLastLoggedInAt()
        const bLoginTime = b.getLastLoggedInAt()

        if (!aLoginTime) return 1
        if (!bLoginTime) return -1

        return aLoginTime.getTime() - bLoginTime.getTime()
      })
      .map((member) => member.getId())

    const bot = this.getBot()

    if (bot) {
      ids.unshift(bot.getId())
    }

    return ids
  }

  private logMessage(message: Message): void {
    const memberId = message.getAuthorId()
    const content = message.getContent()
    const tags = message.getTags()
    const isBot = memberId === this.getBot().getId()

    let result = ''

    if (isBot) {
      result = `🤖: ${content}`
    } else {
      result = `💬 ${memberId}: ${content}`
    }

    if (tags.length > 0) {
      result += ` @${tags.join(', @')}`
    }

    console.log(result)
  }

  sendMessage({
    authorId,
    content,
    tags,
  }: {
    authorId: string
    content: string
    tags: string[]
  }) {
    const isBot = authorId === this.getBot().getId()
    const sender = this.getMemberById(authorId)

    if (!isBot && !sender) {
      throw new Error('Member not found')
    }
    // 必須 已登入
    if (!isBot && !sender?.getIsOnline()) {
      throw new Error('尚未登入')
    }

    const message = new Message({
      authorId,
      content,
      tags,
    })

    this.getChatRoom().addMessage(message)

    this.logMessage(message)

    if (authorId === this.getBot().getId()) {
      return
    }

    this.triggerEvent(
      new SendMessageEvent({
        context: this,
        message,
      }),
    )

    // 如果 tags 中有 'bot', 即指令
    if (tags.includes('bot')) {
      this.getBot().handleMessage(this, message)
    }
  }

  private logPost(post: Post): void {
    const memberId = post.getAuthorId()
    const title = post.getTitle()
    const content = post.getContent()
    const tags = post.getTags()
    let result = `${memberId}: 【${title}】${content}`

    if (tags.length > 0) {
      result += ` @${tags.join(', @')}`
    }

    console.log(result)
  }

  publishPost({
    id,
    authorId,
    title,
    content,
    tags = [],
  }: {
    id: string
    authorId: string
    title: string
    content: string
    tags?: string[]
  }) {
    const member = this.getMemberById(authorId)
    if (!member) {
      throw new Error('Member not found')
    }
    const post = new Post({
      id,
      authorId,
      title,
      content,
      tags,
    })
    this.getForum().publishPost(post)

    this.logPost(post)

    if (authorId === this.getBot().getId()) {
      return
    }

    this.triggerEvent(
      new PublishPostEvent({
        context: this,
        post,
      }),
    )
  }

  private logComment(comment: Comment): void {
    const postId = comment.getPostId()
    const memberId = comment.getMemberId()
    const content = comment.getContent()
    const tags = comment.getTags()
    let result = ''

    if (memberId === this.getBot().getId()) {
      result = `🤖 comment in post ${postId}: ${content}`
      if (tags.length > 0) {
        result += ` @${tags.join(', @')}`
      }
      console.log(result)
    }
  }

  publishComment({
    postId,
    memberId,
    content,
    tags = [],
  }: {
    postId: string
    memberId: string
    content: string
    tags?: string[]
  }) {
    const isBot = memberId === this.getBot().getId()
    const member = this.getMemberById(memberId)
    if (!isBot && !member) {
      throw new Error('Member not found')
    }
    const post = this.getForum().getPostById(postId)

    if (!post) {
      throw new Error('Post not found')
    }

    const comment = new Comment({
      memberId,
      content,
      tags,
    })

    post.addComment(comment)

    this.logComment(comment)
  }

  speak({ speakerId, content }: { speakerId: string; content: string }) {
    const broadcast = this.getBroadcast()
    if (broadcast.getSpeakerId() !== speakerId) {
      return
    }
    const isBot = speakerId === this.getBot().getId()
    broadcast.speak({ speakerId, content })
    if (!isBot) {
      console.log(`📢 ${speakerId}: ${content}`)
    }

    if (isBot) {
      console.log(`🤖 speaking: ${content}`)
    }
  }

  goBroadcasting({ speakerId }: { speakerId: string }): void {
    const isBot = speakerId === this.getBot().getId()
    const member = this.getMemberById(speakerId)
    if (!isBot && !member) {
      throw new Error('Member not found')
    }
    this.getBroadcast().goBroadcasting({ speakerId })
    if (isBot) {
      console.log('🤖 go broadcasting...')
    }
    if (!isBot) {
      console.log(`📢 ${speakerId} is broadcasting...`)
    }
    this.triggerEvent(
      new StartBroadcastingEvent({
        context: this,
      }),
    )
  }

  stopBroadcasting({ speakerId }: { speakerId: string }): void {
    const isBot = speakerId === this.getBot().getId()
    const member = this.getMemberById(speakerId)
    if (!isBot && !member) {
      throw new Error('Member not found')
    }
    const broadcast = this.getBroadcast()
    if (isBot) {
      console.log('🤖 stop broadcasting...')
    }
    if (!isBot) {
      console.log(`📢 ${speakerId} stop broadcasting`)
    }
    if (broadcast.getIsRecording()) {
      broadcast.recordReplay()
    }
    this.triggerEvent(
      new StopBroadcastingEvent({
        context: this,
        speakerId,
      }),
    )
    broadcast.stopBroadcasting({ speakerId })
  }
}
