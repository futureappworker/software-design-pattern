import type { Unit } from '../../Unit/Unit'
import { AttackAction } from '../AttackAction'

export abstract class Skill extends AttackAction {
  abstract execute(self: Unit, targets: Unit[]): void
}
