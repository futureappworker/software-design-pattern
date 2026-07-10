import type { AttackAction } from '../../../../AttackAction/AttackAction'
import { BasicAttackAction } from '../../../../AttackAction/BasicAttackAction/BasicAttackAction'
import type { Unit } from '../../../Unit'
import { AI } from '../../AI'
import type { AIActionSelectionStrategy } from '../AIActionSelectionStrategy'

export class SeedAIActionSelectionStrategy
  implements AIActionSelectionStrategy
{
  chooseAction(self: Unit): AttackAction {
    // AI 會選擇第 seed % 行動數量 個行動。
    // 舉例來說，當輪到某 AI 且其 seed=0 且擁有四項技能。
    // 則此 AI 會選擇第 0 項行動（普通攻擊），而如果 seed=1，
    // 則 AI 會選擇第 1 項行動（也就是技能 1），
    // 如果 AI 不具備足夠 MP 來執行技能 1，則 AI 會被迫再決定一次行動，
    // 此時 seed=2，因此 AI 會選擇第 2 項行動，以此類推，直到 AI 選擇了合法的行動為止。
    if (!(self instanceof AI)) {
      throw new Error('SeedAIActionSelectionStrategy can only be used by AI')
    }

    const actions = [new BasicAttackAction(), ...self.getSkills()]
    const options = actions
      .map((action, index) => `(${index}) ${action.getName()}`)
      .join(' ')
    console.log(`選擇行動：${options}`)

    const selectedIndex = self.getSeed() % actions.length
    self.incrementSeed()
    return actions[selectedIndex]
  }
}
