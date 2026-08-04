import { BotFacade } from './BotFacade/BotFacade'
import { WaterballCommunity } from './WaterballCommunity/src'

const bot = new BotFacade({
  hasRecordFSM: true,
  hasKnowledgeKingFSM: true,
})

const waterballCommunity = new WaterballCommunity({
  bot,
  quota: 20,
  members: [],
})

waterballCommunity.handleEnterNormalEvent()
