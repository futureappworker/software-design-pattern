import type { Message } from './Message'

type ChatRoomProps = {
  messages?: Message[]
}

export class ChatRoom {
  private messages: Message[] = []

  constructor({ messages = [] }: ChatRoomProps) {
    this.setMessages(messages)
  }

  getMessages(): Message[] {
    return [...this.messages]
  }

  setMessages(messages: Message[]): void {
    this.messages = [...messages]
  }

  addMessage(message: Message): void {
    this.messages.push(message)
  }
}
