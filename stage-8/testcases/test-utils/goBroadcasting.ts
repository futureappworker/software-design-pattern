import type { WaterballCommunity } from '../../WaterballCommunity/src'

type GoBroadcastingParams = {
  waterballCommunity: WaterballCommunity
  speakerId: string
}

export function goBroadcasting({
  waterballCommunity,
  speakerId,
}: GoBroadcastingParams): void {
  waterballCommunity.goBroadcasting({ speakerId })
}
