import type { AIChooseCardStrategy } from './domain/AIPlayer/AIChooseCardStrategy'
import { AIPlayer } from './domain/AIPlayer/AIPlayer'
import { RandomAIChooseCardStrategy } from './domain/AIPlayer/RandomAIChooseCardStrategy'
import { Card } from './domain/Card/Card'
import { CardGameFramework } from './domain/CardGameFramework/CardGameFramework'
import { Deck } from './domain/Deck/Deck'
import { Game } from './domain/Game/Game'
import { CliHumanChooseCardStrategy } from './domain/HumanPlayer/CliHumanChooseCardStrategy'
import type { HumanChooseCardStrategy } from './domain/HumanPlayer/HumanChooseCardStrategy'
import { HumanPlayer } from './domain/HumanPlayer/HumanPlayer'
import { Player } from './domain/Player/Player'

export type { AIChooseCardStrategy, HumanChooseCardStrategy }

export {
  AIPlayer,
  Card,
  CardGameFramework,
  CliHumanChooseCardStrategy,
  Deck,
  Game,
  HumanPlayer,
  Player,
  RandomAIChooseCardStrategy,
}
