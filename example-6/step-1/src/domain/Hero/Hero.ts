import { shouldBeGreaterThanOrEqual } from '../../utils/shouldBeGreaterThanOrEqual'

type HeroProps = {
  name: string
  attackType: string
  hp?: number
}

const defaultProps = {
  hp: 500,
}

export class Hero {
  private name: string
  private hp: number = defaultProps.hp
  private attackType: string

  /**
   * 初始化英雄
   * @param name 英雄名稱
   * @param attackType 攻擊類型（Waterball、Fireball、Earth）
   * @param hp 初始血量（必須 >= 0，預設 500）
   * @throws 如果 hp 驗證失敗
   */
  constructor({ name, attackType, hp = defaultProps.hp }: HeroProps) {
    this.name = name
    this.setHp(hp)
    this.attackType = attackType
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
   * 獲取攻擊類型
   * @returns 攻擊類型
   */
  getAttackType() {
    return this.attackType
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
   * 攻擊另一位英雄
   * - Waterball：造成一次傷害，傷害為自身血量 x 0.5
   * - Fireball：連續造成三次傷害，每次 50 點
   * - Earth：連續造成十次傷害，每次 20 點
   * @param hero 被攻擊的英雄
   * @throws 如果 attackType 無效
   */
  attackHero(hero: Hero) {
    const attackType = this.getAttackType()
    switch (attackType) {
      case 'Waterball': {
        // 造成一次傷害, 傷害為自身的血量 x 0.5
        const damage = this.getHp() * 0.5
        hero.setHp(Math.max(0, hero.getHp() - damage))
        console.log(
          `${this.getName()} 使用 ${attackType} 攻擊 ${hero.getName()}，造成 ${damage} 點傷害`,
        )
        break
      }
      case 'Fireball': {
        // 連續造成三次傷害, 每次的傷害值為 50
        for (let i = 0; i < 3; i++) {
          const damage = 50
          hero.setHp(Math.max(0, hero.getHp() - damage))
          console.log(
            `${this.getName()} 使用 ${attackType} 攻擊 ${hero.getName()}，造成 ${damage} 點傷害`,
          )
        }
        break
      }
      case 'Earth': {
        // 造成十次傷害, 每次的傷害值為 20
        for (let i = 0; i < 10; i++) {
          const damage = 20
          hero.setHp(Math.max(0, hero.getHp() - damage))
          console.log(
            `${this.getName()} 使用 ${attackType} 攻擊 ${hero.getName()}，造成 ${damage} 點傷害`,
          )
        }
        break
      }
      default:
        throw new Error('Invalid attack type')
    }
  }
}
