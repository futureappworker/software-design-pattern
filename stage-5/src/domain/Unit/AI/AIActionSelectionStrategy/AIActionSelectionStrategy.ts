import type { AttackAction } from '../../../AttackAction/AttackAction'
import type { Unit } from '../../Unit'

export interface AIActionSelectionStrategy {
  chooseAction(self: Unit): AttackAction
}
