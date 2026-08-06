import type { WaterballCommunity } from '../../../WaterballCommunity/src'

type NewPostParams = {
  waterballCommunity: WaterballCommunity
  id: string
  authorId: string
  title: string
  content: string
  tags: string[]
}

export function newPost({
  waterballCommunity,
  id,
  authorId,
  title,
  content,
  tags,
}: NewPostParams): void {
  waterballCommunity.publishPost({
    id,
    authorId: authorId,
    title,
    content,
    tags,
  })
}
