import { BotFacade } from './BotFacade/BotFacade'
import {
  Member,
  MemberRole,
  WaterballCommunity,
} from './WaterballCommunity/src'

const bot = new BotFacade({
  hasRecordFSM: true,
  hasKnowledgeKingFSM: true,
})

// [started] {"time": "2023-08-07 00:00:00", "quota": 20}
const waterballCommunity = new WaterballCommunity({
  bot,
  quota: 20,
  members: [],
})

waterballCommunity.handleEnterNormalEvent()

// [login] {"userId": "1", "isAdmin": false}
const member = new Member({
  id: '1',
  role: MemberRole.MEMBER,
})
waterballCommunity.addMember(member)
waterballCommunity.login(member.getId())

// [new message] {"authorId": "1", "content": "大家好～", "tags": []}
waterballCommunity.sendMessage({
  authorId: member.getId(),
  content: '大家好～',
  tags: [],
})
