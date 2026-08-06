import type { WaterballCommunity } from '../../../WaterballCommunity/src'

type StopBroadcastingParams = {
  waterballCommunity: WaterballCommunity
  speakerId: string
}

export function stopBroadcasting({
  waterballCommunity,
  speakerId,
}: StopBroadcastingParams): void {
  waterballCommunity.stopBroadcasting({ speakerId })
}
