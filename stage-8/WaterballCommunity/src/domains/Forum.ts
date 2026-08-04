import type { Post } from './Post'

type ForumProps = {
  posts?: Post[]
}

export class Forum {
  private posts: Post[] = []

  constructor({ posts = [] }: ForumProps) {
    this.setPosts(posts)
  }

  getPosts(): Post[] {
    return [...this.posts]
  }

  setPosts(posts: Post[]): void {
    this.posts = [...posts]
  }

  getPostById(id: string): Post | undefined {
    return this.posts.find((post) => post.getId() === id)
  }

  publishPost(post: Post) {
    this.posts.push(post)
  }
}
