import type { WaterballCommunity } from '../../../WaterballCommunity/src'

type NewMessageParams = {
  waterballCommunity: WaterballCommunity
  authorId: string
  content: string
  tags: string[]
}

export function newMessage({
  waterballCommunity,
  authorId,
  content,
  tags,
}: NewMessageParams): void {
  waterballCommunity.sendMessage({
    authorId,
    content,
    tags,
  })
}
