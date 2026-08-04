import { shouldBeWithinRange } from '../utils/shouldBeWithinRange'
import type { Comment } from './Comment'

type PostProps = {
  id: string
  authorId: string
  title: string
  content: string
  tags?: string[]
  comments?: Comment[]
}

export class Post {
  private id!: string
  private authorId!: string
  private title!: string
  private content!: string
  private tags: string[] = []
  private comments: Comment[] = []

  constructor({
    id,
    authorId,
    title,
    content,
    tags = [],
    comments = [],
  }: PostProps) {
    this.setId(id)
    this.setAuthorId(authorId)
    this.setTitle(title)
    this.setContent(content)
    this.setTags(tags)
    this.setComments(comments)
  }

  getId(): string {
    return this.id
  }

  setId(id: string): void {
    this.id = id
  }

  getAuthorId(): string {
    return this.authorId
  }

  setAuthorId(authorId: string): void {
    this.authorId = authorId
  }

  getTitle(): string {
    return this.title
  }

  setTitle(title: string): void {
    this.title = title
  }

  getContent(): string {
    return this.content
  }

  setContent(content: string): void {
    // content 1~1000 字元
    shouldBeWithinRange({
      name: 'content 的範圍',
      num: content.length,
      inclusiveMin: 1,
      inclusiveMax: 1000,
    })
    this.content = content
  }

  getTags(): string[] {
    return this.tags
  }

  setTags(tags: string[]): void {
    this.tags = tags
  }

  getComments(): Comment[] {
    return this.comments
  }

  setComments(comments: Comment[]): void {
    this.comments = comments
  }

  addComment(comment: Comment): void {
    this.comments.push(comment)
    comment.setPostId(this.getId())
  }
}
