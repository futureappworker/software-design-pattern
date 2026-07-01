import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Big2 } from '../domain/Big2/Big2'
import { Card } from '../domain/Card/Card'
import { type Rank, rankSymbols } from '../domain/Card/Rank'
import { type Suit, suitSymbols } from '../domain/Card/Suit'
import { Deck } from '../domain/Deck/Deck'
import type { Player } from '../domain/Player/Player'
import { CompareCardPatternFullHouseHandler } from '../domain/RuleEngine/CompareCardPatternHandler/CompareCardPatternFullHouseHandler/CompareCardPatternFullHouseHandler'
import { CompareCardPatternPairHandler } from '../domain/RuleEngine/CompareCardPatternHandler/CompareCardPatternPairHandler/CompareCardPatternPairHandler'
import { CompareCardPatternSingleHandler } from '../domain/RuleEngine/CompareCardPatternHandler/CompareCardPatternSingleHandler/CompareCardPatternSingleHandler'
import { CompareCardPatternStraightHandler } from '../domain/RuleEngine/CompareCardPatternHandler/CompareCardPatternStraightHandler/CompareCardPatternStraightHandler'
import { FindPlayablePatternsFullHouseHandler } from '../domain/RuleEngine/FindPlayablePatternsHandler/FindPlayablePatternsFullHouseHandler/FindPlayablePatternsFullHouseHandler'
import { FindPlayablePatternsPairHandler } from '../domain/RuleEngine/FindPlayablePatternsHandler/FindPlayablePatternsPairHandler/FindPlayablePatternsPairHandler'
import { FindPlayablePatternsSingleHandler } from '../domain/RuleEngine/FindPlayablePatternsHandler/FindPlayablePatternsSingleHandler/FindPlayablePatternsSingleHandler'
import { FindPlayablePatternsStraightHandler } from '../domain/RuleEngine/FindPlayablePatternsHandler/FindPlayablePatternsStraightHandler/FindPlayablePatternsStraightHandler'
import { ParseCardPatternFullHouseHandler } from '../domain/RuleEngine/ParseCardPatternHandler/ParseCardPatternFullHouseHandler/ParseCardPatternFullHouseHandler'
import { ParseCardPatternPairHandler } from '../domain/RuleEngine/ParseCardPatternHandler/ParseCardPatternPairHandler/ParseCardPatternPairHandler'
import { ParseCardPatternSingleHandler } from '../domain/RuleEngine/ParseCardPatternHandler/ParseCardPatternSingleHandler/ParseCardPatternSingleHandler'
import { ParseCardPatternStraightHandler } from '../domain/RuleEngine/ParseCardPatternHandler/ParseCardPatternStraightHandler/ParseCardPatternStraightHandler'

const scenarioDir = dirname(fileURLToPath(import.meta.url))

const suitBySymbol = Object.fromEntries(
  Object.entries(suitSymbols).map(([suit, symbol]) => [symbol, Number(suit)]),
) as Record<string, Suit>

const rankBySymbol = Object.fromEntries(
  Object.entries(rankSymbols).map(([rank, symbol]) => [symbol, Number(rank)]),
) as Record<string, Rank>

export type ScenarioInput = {
  deckCards: Card[]
  playerNames: string[]
  actions: string[]
}

export function parseScenarioInput(baseName: string): ScenarioInput {
  const content = readFileSync(join(scenarioDir, `${baseName}.in`), 'utf-8')
  const lines = content
    .trimEnd()
    .split('\n')
    .map((line) => line.trim())

  return {
    deckCards: lines[0].split(' ').map(parseCardToken),
    playerNames: lines.slice(1, 5),
    actions: lines.slice(5),
  }
}

export function readScenarioOutput(baseName: string): string {
  return readFileSync(join(scenarioDir, `${baseName}.out`), 'utf-8').trimEnd()
}

function parseCardToken(token: string): Card {
  const match = token.match(/^([CDHS])\[([^\]]+)\]$/)
  if (!match) {
    throw new Error(`Invalid card token: ${token}`)
  }

  const [, suitSymbol, rankSymbol] = match
  const suit = suitBySymbol[suitSymbol]
  const rank = rankBySymbol[rankSymbol]

  if (suit === undefined || rank === undefined) {
    throw new Error(`Invalid card token: ${token}`)
  }

  return new Card({ suit, rank })
}

export function createBig2(deckCards: Card[], players: Player[]) {
  const parseCardPatternHandler = new ParseCardPatternSingleHandler(
    new ParseCardPatternPairHandler(
      new ParseCardPatternStraightHandler(
        new ParseCardPatternFullHouseHandler(null),
      ),
    ),
  )

  const compareCardPatternHandler = new CompareCardPatternSingleHandler(
    new CompareCardPatternPairHandler(
      new CompareCardPatternStraightHandler(
        new CompareCardPatternFullHouseHandler(null),
      ),
    ),
  )

  const findPlayablePatternsHandler = new FindPlayablePatternsSingleHandler(
    new FindPlayablePatternsPairHandler(
      new FindPlayablePatternsStraightHandler(
        new FindPlayablePatternsFullHouseHandler(null),
      ),
    ),
  )

  const deck = new Deck({ cards: deckCards })

  return new Big2({
    isTestMode: true,
    parseCardPatternHandler,
    compareCardPatternHandler,
    findPlayablePatternsHandler,
    deck,
    players,
  })
}
