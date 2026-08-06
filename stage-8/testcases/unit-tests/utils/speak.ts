import { WaterballCommunity } from "../../../WaterballCommunity/src"

type SpeakParams = {
  waterballCommunity: WaterballCommunity
  speakerId: string
  content: string
}

export function speak({
  waterballCommunity,
  speakerId,
  content,
}: SpeakParams): void {
  waterballCommunity.speak({ speakerId, content })
}