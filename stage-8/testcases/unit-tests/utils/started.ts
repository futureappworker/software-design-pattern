import { BotFacade } from '../../../BotFacade/BotFacade'
import { WaterballCommunity } from '../../../WaterballCommunity/src'

type StartedParams = {
  time: string
  quota: number
}

export function started({ quota }: StartedParams): WaterballCommunity {
  const bot = new BotFacade({
    hasRecordFSM: true,
    hasKnowledgeKingFSM: true,
  })

  const waterballCommunity = new WaterballCommunity({
    bot,
    quota,
    members: [],
  })

  waterballCommunity.handleEnterNormalEvent()

  return waterballCommunity
}
