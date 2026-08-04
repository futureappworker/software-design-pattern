import type { FiniteStateMachine } from '../FSM/src'
import type { BaseEvent } from '../FSMPlugin/src/domains/BaseEvent'
import { AllQuestionsAnsweredTransition } from '../FSMPlugin/src/domains/KnowledgeKing/children/AllQuestionsAnsweredTransition/AllQuestionsAnsweredTransition'
import { AnswerTimeEndedTransition } from '../FSMPlugin/src/domains/KnowledgeKing/children/AnswerTimeEndedTransition/AnswerTimeEndedTransition'
import { PlayAgainCommandTransition } from '../FSMPlugin/src/domains/KnowledgeKing/children/PlayAgainCommandTransition/PlayAgainCommandTransition'
import { KnowledgeKingFSM } from '../FSMPlugin/src/domains/KnowledgeKing/KnowledgeKingFSM'
import { KingCommandTransition } from '../FSMPlugin/src/domains/KnowledgeKing/transitions/KingCommandTransition/KingCommandTransition'
import { KingStopCommandTransition } from '../FSMPlugin/src/domains/KnowledgeKing/transitions/KingStopCommandTransition/KingStopCommandTransition'
import { KnowledgeKingEndedTransition } from '../FSMPlugin/src/domains/KnowledgeKing/transitions/KnowledgeKingEndedTransition/KnowledgeKingEndedTransition'
import { AOnlineMemberCountChangedTransition } from '../FSMPlugin/src/domains/Normal/children/AOnlineMemberCountChangedTransition/AOnlineMemberCountChangedTransition'
import { BOnlineMemberCountChangedTransition } from '../FSMPlugin/src/domains/Normal/children/BOnlineMemberCountChangedTransition/BOnlineMemberCountChangedTransition'
import { NormalFSM } from '../FSMPlugin/src/domains/Normal/NormalFSM'
import { EnterNormalTransition } from '../FSMPlugin/src/domains/Normal/transitions/EnterNormalTransition/EnterNormalTransition'
import { StopBroadcastingTransition } from '../FSMPlugin/src/domains/Record/children/StopBroadcastingTransition/StopBroadcastingTransition'
import { RecordFSM } from '../FSMPlugin/src/domains/Record/RecordFSM'
import { RecordCommandTransition } from '../FSMPlugin/src/domains/Record/transitions/RecordCommandTransition/RecordCommandTransition'
import { StopRecordingTransition } from '../FSMPlugin/src/domains/Record/transitions/StopRecordingTransition/StopRecordingTransition'
import { RootFSM } from '../FSMPlugin/src/domains/RootFSM'
import { Bot } from '../WaterballCommunityBot/src'

type BotFacadeProps = {
  id?: string
  hasRecordFSM: boolean
  hasKnowledgeKingFSM: boolean
}

export class BotFacade extends Bot {
  constructor({
    id = 'bot',
    hasRecordFSM,
    hasKnowledgeKingFSM,
  }: BotFacadeProps) {
    const finiteStateMachine = new RootFSM({})

    super({
      id,
      finiteStateMachine,
    })

    this.addNormalFSM(finiteStateMachine)

    if (hasRecordFSM) {
      this.addRecordFSM(finiteStateMachine)
    }

    if (hasKnowledgeKingFSM) {
      this.addKnowledgeKingFSM(finiteStateMachine)
    }
  }

  private addNormalFSM(
    finiteStateMachine: FiniteStateMachine<BaseEvent>,
  ): void {
    const normalFSM = new NormalFSM({})
    normalFSM.addTransition(new AOnlineMemberCountChangedTransition())
    normalFSM.addTransition(new BOnlineMemberCountChangedTransition())

    finiteStateMachine.addChild(normalFSM)

    finiteStateMachine.addTransition(new EnterNormalTransition())
  }

  private addRecordFSM(
    finiteStateMachine: FiniteStateMachine<BaseEvent>,
  ): void {
    const recordFSM = new RecordFSM({})
    recordFSM.addTransition(new StopBroadcastingTransition())

    finiteStateMachine.addChild(recordFSM)

    finiteStateMachine.addTransition(new RecordCommandTransition())
    finiteStateMachine.addTransition(new StopRecordingTransition())
  }

  private addKnowledgeKingFSM(
    finiteStateMachine: FiniteStateMachine<BaseEvent>,
  ): void {
    const knowledgeKingFSM = new KnowledgeKingFSM({})

    knowledgeKingFSM.addTransition(new AllQuestionsAnsweredTransition())
    knowledgeKingFSM.addTransition(new AnswerTimeEndedTransition())
    knowledgeKingFSM.addTransition(new PlayAgainCommandTransition())

    finiteStateMachine.addChild(knowledgeKingFSM)

    finiteStateMachine.addTransition(new KingCommandTransition())
    finiteStateMachine.addTransition(new KingStopCommandTransition())
    finiteStateMachine.addTransition(new KnowledgeKingEndedTransition())
  }
}
