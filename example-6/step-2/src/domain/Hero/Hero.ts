import { shouldBeGreaterThanOrEqual } from '../../utils/shouldBeGreaterThanOrEqual'
import type { AttackTypeStrategy } from './AttackTypeStrategy'

type HeroProps = {
  name: string
  attackTypeStrategy: AttackTypeStrategy
  hp?: number
}

const defaultProps = {
  hp: 500,
}

export class Hero {
  private name: string
  private attackTypeStrategy: AttackTypeStrategy
  private hp: number = defaultProps.hp

  /**
   * 初始化英雄
   * @param name 英雄名稱
   * @param attackTypeStrategy 攻擊策略（Waterball、Fireball、Earth）
   * @param hp 初始血量（必須 >= 0，預設 500）
   * @throws 如果 hp 驗證失敗
   */
  constructor({ name, attackTypeStrategy, hp = defaultProps.hp }: HeroProps) {
    this.name = name
    this.attackTypeStrategy = attackTypeStrategy
    this.setHp(hp)
  }

  /**
   * 獲取英雄名稱
   * @returns 英雄名稱
   */
  getName() {
    return this.name
  }

  /**
   * 獲取英雄血量
   * @returns 英雄血量
   */
  getHp() {
    return this.hp
  }

  /**
   * 判斷英雄是否死亡
   * @returns 血量 <= 0 時為 true
   */
  isDead() {
    return this.getHp() <= 0
  }

  /**
   * 設置英雄血量
   * @param hp 新的血量（必須 >= 0）
   * @throws 如果 hp 小於 0
   */
  setHp(hp: number) {
    shouldBeGreaterThanOrEqual({
      name: 'hp',
      num: hp,
      target: 0,
    })
    this.hp = hp
  }

  /**
   * 攻擊另一位英雄，由注入的 attackTypeStrategy 決定攻擊行為
   * @param hero 被攻擊的英雄
   */
  attackHero(hero: Hero) {
    this.attackTypeStrategy.attack(this, hero)
  }

  /**
   * 承受傷害，血量不會低於 0
   * @param damage 傷害值
   */
  takeDamage(damage: number) {
    this.setHp(Math.max(0, this.getHp() - damage))
  }
}
