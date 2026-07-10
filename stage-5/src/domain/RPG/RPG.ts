import type { AttackAction } from '../AttackAction/AttackAction'
import { AttackActionTargetType } from '../AttackAction/AttackActionTargetType/AttackActionTargetType'
import type { Troop } from '../Troop/Troop'
import { Hero } from '../Unit/Hero/Hero'
import type { Unit } from '../Unit/Unit'

type RPGProps = {
  allies: Troop
  enemies: Troop
}

export class RPG {
  private allies!: Troop
  private enemies!: Troop

  constructor({ allies, enemies }: RPGProps) {
    this.setAllies(allies)
    this.setEnemies(enemies)
  }

  private getAllies() {
    return this.allies
  }
  setAllies(allies: Troop) {
    // 如果 allies 有第一個單位，則一定要是 Hero
    if (
      allies.getUnits().length > 0 &&
      !(allies.getUnits()[0] instanceof Hero)
    ) {
      throw new Error('The first unit of allies must be Hero')
    }
    this.allies = allies
  }
  addAlly(ally: Unit) {
    // 如果 allies 沒有第一個單位，則 ally 一定要是 Hero
    if (this.allies.getUnits().length === 0 && !(ally instanceof Hero)) {
      throw new Error('The first unit of allies must be Hero')
    }
    this.allies.addUnit(ally)
  }

  private getEnemies() {
    return this.enemies
  }
  setEnemies(enemies: Troop) {
    this.enemies = enemies
  }
  addEnemy(enemy: Unit) {
    this.enemies.addUnit(enemy)
  }

  private printStatus(unit: Unit) {
    // 輪到 <角色名稱> (HP: <HP>, MP: <MP>, STR: <STR>, State: <狀態>)。
    console.log(
      `輪到 ${unit.getLogName()} (HP: ${unit.getHp()}, MP: ${unit.getMp()}, STR: ${unit.getStr()}, State: ${unit.getStatus().getType()})。`,
    )
  }

  private resolveStatus(unit: Unit) {
    unit.resolveStatus()
  }

  private async chooseAction(unit: Unit): Promise<AttackAction> {
    const attackAction = await unit.chooseAction()
    if (unit.getMp() < attackAction.getMpCost()) {
      console.log('你缺乏 MP，不能進行此行動。')
      return this.chooseAction(unit)
    }
    return attackAction
  }

  private async chooseTargets(
    unit: Unit,
    attackAction: AttackAction,
  ): Promise<Unit[]> {
    let hero: Hero | undefined
    let candidates: Unit[] = []
    const targetCount = attackAction.getTargetCount()

    switch (attackAction.getTarget()) {
      case AttackActionTargetType.All: {
        const aliveAllies = this.getAliveAllies()
        const aliveEnemies = this.getAliveEnemies()
        candidates = [...aliveAllies, ...aliveEnemies]
        break
      }
      case AttackActionTargetType.Ally:
        // unit 所在的軍隊中，有 hero 嗎
        hero = unit
          .getTroop()
          .getUnits()
          .find((u) => u instanceof Hero)
        if (hero) {
          // 友軍，就是 allies 中, 除了 unit 以外的所有存活的單位
          candidates = this.getAllies()
            .getAliveUnits()
            .filter((u) => u !== unit)
        }
        if (!hero) {
          // 友軍，就是 enemies 中, 除了 unit 以外的所有存活的單位
          candidates = this.getEnemies()
            .getAliveUnits()
            .filter((u) => u !== unit)
        }
        break
      case AttackActionTargetType.Enemy:
        // unit 所在的軍隊中，有 hero 嗎
        hero = unit
          .getTroop()
          .getUnits()
          .find((u) => u instanceof Hero)
        if (hero) {
          // 敵軍，就是 enemies 中, 除了 unit 以外的所有存活的單位
          candidates = this.getEnemies()
            .getAliveUnits()
            .filter((u) => u !== unit)
        }
        if (!hero) {
          // 敵軍，就是 allies 中, 除了 unit 以外的所有存活的單位
          candidates = this.getAllies()
            .getAliveUnits()
            .filter((u) => u !== unit)
        }
        break
      case AttackActionTargetType.Self:
        candidates = [unit]
        break
      case AttackActionTargetType.None:
        candidates = []
        break
    }

    if (
      // 目標為 0
      targetCount === 0 ||
      // 候選角色數量小於等於目標數量
      candidates.length <= targetCount ||
      // 目標為 -1，則選擇所有候選角色
      targetCount === -1 ||
      // 候選角色數量為 0
      candidates.length === 0
    ) {
      return candidates
    }

    while (true) {
      const targets = await unit.chooseTargets(candidates, targetCount)

      // 如果選擇的角色數量等於目標數量，則返回選擇的角色
      if (targets.length === attackAction.getTargetCount()) {
        return targets
      }
    }
  }

  private getAliveAllies() {
    return this.allies.getAliveUnits()
  }

  private getAliveEnemies() {
    return this.enemies.getAliveUnits()
  }

  private isGameOver() {
    const hero = this.getAllies().getUnits()[0]
    if (
      hero.isDead() ||
      this.getAllies().isAnnihilated() ||
      this.getEnemies().isAnnihilated()
    ) {
      return true
    }
    return false
  }

  private showBattleResult() {
    // 當遊戲結束時，如果玩家（英雄方）勝利，輸出一行訊息：你獲勝了！ ，
    // 否則輸出一行訊息：你失敗了！
    if (this.isGameOver()) {
      if (this.getAllies().isAnnihilated()) {
        console.log('你失敗了！')
      } else {
        console.log('你獲勝了！')
      }
    }
  }

  private executeAction(
    unit: Unit,
    attackAction: AttackAction,
    targets: Unit[],
  ) {
    unit.spendMp(attackAction.getMpCost())
    attackAction.execute(unit, targets)
  }

  async battle() {
    Round: while (!this.isGameOver()) {
      const aliveAllies = this.getAliveAllies()
      const aliveEnemies = this.getAliveEnemies()

      // loop aliveAllies
      for (const ally of aliveAllies) {
        if (ally.isDead()) {
          continue
        }
        this.printStatus(ally)
        this.resolveStatus(ally)
        if (ally.isDead()) {
          if (this.isGameOver()) {
            break Round
          }
          continue
        }
        const attackAction = await this.chooseAction(ally)
        const targets = await this.chooseTargets(ally, attackAction)
        this.executeAction(ally, attackAction, targets)

        if (this.isGameOver()) {
          break Round
        }
      }

      // loop aliveEnemies
      for (const enemy of aliveEnemies) {
        if (enemy.isDead()) {
          continue
        }
        this.printStatus(enemy)
        this.resolveStatus(enemy)
        if (enemy.isDead()) {
          if (this.isGameOver()) {
            break Round
          }
          continue
        }
        const attackAction = await this.chooseAction(enemy)
        const targets = await this.chooseTargets(enemy, attackAction)
        this.executeAction(enemy, attackAction, targets)

        if (this.isGameOver()) {
          break Round
        }
      }
    }

    this.showBattleResult()
  }
}
