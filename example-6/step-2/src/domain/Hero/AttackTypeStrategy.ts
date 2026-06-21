import type { Hero } from './Hero'

export interface AttackTypeStrategy {
  getName(): string
  attack(attacker: Hero, defender: Hero): void
}
