import {
  Member,
  MemberRole,
  type WaterballCommunity,
} from '../../../WaterballCommunity/src'

type LoginParams = {
  waterballCommunity: WaterballCommunity
  userId: string
  isAdmin: boolean
}

export function login({
  waterballCommunity,
  userId,
  isAdmin,
}: LoginParams): Member {
  const member = new Member({
    id: userId,
    role: isAdmin ? MemberRole.ADMIN : MemberRole.MEMBER,
  })
  waterballCommunity.addMember(member)
  waterballCommunity.login(member.getId())

  return member
}
