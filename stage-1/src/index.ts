import { Deck } from './domain/Deck/Deck'
import { Showdown } from './domain/Showdown/Showdown'

const deck = new Deck({})

deck.initialize()

const showdown = new Showdown({
  deck,
})

showdown.startGame()
