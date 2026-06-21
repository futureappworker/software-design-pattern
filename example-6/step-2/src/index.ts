import { Game } from './domain/Game/Game'
import { Fireball } from './domain/Hero/AttackTypes/Fireball'
import { Waterball } from './domain/Hero/AttackTypes/Waterball'
import { Hero } from './domain/Hero/Hero'

const game = new Game({
  hero1: new Hero({
    name: 'Hero1',
    attackTypeStrategy: new Waterball({ name: '超級水球' }),
  }),
  hero2: new Hero({ name: 'Hero2', attackTypeStrategy: new Fireball() }),
})

game.start()
