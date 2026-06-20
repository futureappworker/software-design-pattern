import { Game } from './domain/Game/Game'
import { Hero } from './domain/Hero/Hero'

const game = new Game({
  hero1: new Hero({ name: 'Hero1', attackType: 'Fireball' }),
  hero2: new Hero({ name: 'Hero2', attackType: 'Waterball' }),
})

game.start()
