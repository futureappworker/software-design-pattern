type MessageProps = {
  authorId: string
  content: string
  tags?: string[]
}

export class Message {
  private authorId!: string
  private content!: string
  private tags: string[] = []

  constructor({ authorId, content, tags = [] }: MessageProps) {
    this.setAuthorId(authorId)
    this.setContent(content)
    this.setTags(tags)
  }

  getAuthorId(): string {
    return this.authorId
  }

  setAuthorId(authorId: string): void {
    this.authorId = authorId
  }

  getContent(): string {
    return this.content
  }

  setContent(content: string): void {
    this.content = content
  }

  getTags(): string[] {
    return this.tags
  }

  setTags(tags: string[]): void {
    this.tags = tags
  }

  addTag(tag: string): void {
    this.tags.push(tag)
  }
}
