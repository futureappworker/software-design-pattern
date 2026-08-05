import type { WaterballCommunity } from '../../../WaterballCommunity/src'

type LogoutParams = {
  waterballCommunity: WaterballCommunity
  userId: string
}

export function logout({ waterballCommunity, userId }: LogoutParams): void {
  waterballCommunity.logout(userId)
}
