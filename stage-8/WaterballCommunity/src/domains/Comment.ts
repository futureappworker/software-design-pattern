type CommentProps = {
  memberId: string
  content: string
  tags?: string[]
  postId?: string | null
}

export class Comment {
  private memberId!: string
  private content!: string
  private tags: string[] = []
  private postId!: string | null

  constructor({ memberId, content, tags = [], postId = null }: CommentProps) {
    this.setPostId(postId)
    this.setMemberId(memberId)
    this.setContent(content)
    this.setTags(tags)
  }

  getPostId(): string | null {
    return this.postId
  }

  setPostId(postId: string | null): void {
    this.postId = postId
  }

  getMemberId(): string {
    return this.memberId
  }

  setMemberId(memberId: string): void {
    this.memberId = memberId
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
