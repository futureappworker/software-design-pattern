import { AI } from './domain/AI/AI'
import { Game } from './domain/Game/Game'
import { Human } from './domain/Human/Human'

const game = new Game({
  p1: new Human({ number: 1 }),
  p2: new AI({ number: 2 }),
})

game.start()
