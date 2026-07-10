import { getReadline } from '../../../utils/readline'
import type { AttackAction } from '../../AttackAction/AttackAction'
import { BasicAttackAction } from '../../AttackAction/BasicAttackAction/BasicAttackAction'
import { Unit } from '../Unit'

export class Hero extends Unit {
  setName(name: string) {
    // 包含多個字母或是數字的字串
    // 可以中文、英文、數字
    if (!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(name)) {
      throw new Error(
        'name must be a string containing only letters and numbers',
      )
    }
    if (name.length === 0) {
      throw new Error('name must be a non-empty string')
    }
    this.name = name
  }

  /**
   * 透過 CLI 詢問使用者要選擇哪一個行動
   * 輸入行動編號（0 起始）；無效輸入會重新詢問
   * @returns 選擇的行動
   */
  async chooseAction(): Promise<AttackAction> {
    const actions = [new BasicAttackAction(), ...this.getSkills()]
    const rl = getReadline()

    while (true) {
      const options = actions
        .map((action, index) => `(${index}) ${action.getName()}`)
        .join(' ')
      console.log(`選擇行動：${options}`)

      const answer = (await rl.question('')).trim()
      const selectedIndex = Number(answer)

      // Number('') === 0，空字串不能當成選 0
      if (
        answer !== '' &&
        Number.isInteger(selectedIndex) &&
        selectedIndex >= 0 &&
        selectedIndex < actions.length
      ) {
        return actions[selectedIndex]
      }

      console.log(`只能輸入範圍 0~${actions.length - 1} 的數字, 請再輸入一次`)
    }
  }

  /**
   * 透過 CLI 詢問使用者要從候選角色中選擇哪些目標
   * 輸入目標編號（0 起始），多個目標以逗號分隔；無效輸入會重新詢問
   * @param candidates 合法候選目標角色
   * @param targetCount 需要選擇的目標數量
   * @returns 選擇的目標角色
   */
  async chooseTargets(
    candidates: Unit[],
    targetCount: number,
  ): Promise<Unit[]> {
    const rl = getReadline()

    while (true) {
      const options = candidates
        .map((unit, index) => `(${index}) ${this.formatUnitLabel(unit)}`)
        .join(' ')
      console.log(`選擇 ${targetCount} 位目標: ${options}`)

      const answer = (await rl.question('')).trim()
      const selectedIndices = answer
        .split(',')
        .map((part) => part.trim())
        .filter((part) => part !== '')
        .map((part) => Number(part))

      if (
        selectedIndices.length === targetCount &&
        selectedIndices.every(
          (index, i) =>
            Number.isInteger(index) &&
            index >= 0 &&
            index < candidates.length &&
            selectedIndices.indexOf(index) === i,
        )
      ) {
        return selectedIndices.map((index) => candidates[index])
      }

      console.log(
        `請輸入 ${targetCount} 個範圍 0~${candidates.length - 1} 的不重複數字, 請再輸入一次`,
      )
    }
  }

  private formatUnitLabel(unit: Unit): string {
    const troopId = unit.getTroop() === this.getTroop() ? 1 : 2
    return `[${troopId}]${unit.getName()}`
  }
}
