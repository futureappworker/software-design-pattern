import { shouldBeGreaterThanOrEqual } from '../../utils/shouldBeGreaterThanOrEqual'
import type { AttackAction } from '../AttackAction/AttackAction'
import type { Skill } from '../AttackAction/Skill/Skill'
import type { Troop } from '../Troop/Troop'
import type { CurseEffect } from './CurseEffect/CurseEffect'
import type { DeathObserver } from './DeathObserver/DeathObserver'
import { NormalUnitStatus } from './UnitStatus/NormalUnitStatus/NormalUnitStatus'
import type { UnitStatus } from './UnitStatus/UnitStatus'

export type UnitProps = {
  hp: number
  mp: number
  str: number
  status?: UnitStatus
  name: string
  skills: Skill[]
  troop: Troop
}

export abstract class Unit {
  private hp: number = 0
  private mp: number = 0
  private str: number = 0
  private status: UnitStatus = new NormalUnitStatus()
  private statusTurnsLeft: number = 0
  protected name!: string
  private skills: Skill[] = []
  private curseEffects: CurseEffect[] = []
  private deathObservers: DeathObserver[] = []
  private troop!: Troop

  constructor({
    hp,
    mp,
    str,
    status = new NormalUnitStatus(),
    name,
    skills = [],
    troop,
  }: UnitProps) {
    this.setHp(hp)
    this.setMp(mp)
    this.setStr(str)
    this.setName(name)
    this.enterStatus(status)
    this.setSkills(skills)
    this.setTroop(troop)
  }

  getHp() {
    return this.hp
  }
  setHp(hp: number) {
    shouldBeGreaterThanOrEqual({
      name: 'hp',
      num: hp,
      target: 0,
    })
    this.hp = hp
  }

  getMp() {
    return this.mp
  }
  setMp(mp: number) {
    shouldBeGreaterThanOrEqual({
      name: 'mp',
      num: mp,
      target: 0,
    })
    this.mp = mp
  }

  getStr() {
    return this.str
  }
  setStr(str: number) {
    shouldBeGreaterThanOrEqual({
      name: 'str',
      num: str,
      target: 0,
    })
    this.str = str
  }

  getStatus() {
    return this.status
  }

  getStatusTurnsLeft() {
    return this.statusTurnsLeft
  }
  setStatusTurnsLeft(statusTurnsLeft: number) {
    shouldBeGreaterThanOrEqual({
      name: 'statusTurnsLeft',
      num: statusTurnsLeft,
      target: 0,
    })
    this.statusTurnsLeft = statusTurnsLeft
  }

  getName() {
    return this.name
  }
  getLogName() {
    return `[${this.getTroop().getName()}]${this.getName()}`
  }
  setName(name: string) {
    // 包含多個字母或是數字的字串
    if (!/^[a-zA-Z0-9]+$/.test(name)) {
      throw new Error(
        'name must be a string containing only letters and numbers',
      )
    }
    if (name.length === 0) {
      throw new Error('name must be a non-empty string')
    }
    this.name = name
  }

  getSkills() {
    return [...this.skills]
  }
  setSkills(skills: Skill[]) {
    this.skills = [...skills]
  }

  getCurseEffects() {
    return [...this.curseEffects]
  }

  enterStatus(status: UnitStatus) {
    this.status.exitState(this)
    this.status = status
    this.status.enterState(this)
  }

  addDeathObserver(deathObserver: DeathObserver) {
    this.deathObservers.push(deathObserver)
  }

  getTroop() {
    return this.troop
  }
  setTroop(troop: Troop) {
    this.troop = troop
  }

  isDead() {
    return this.hp <= 0
  }

  isAlive() {
    return this.hp > 0
  }

  takeDamage(damage: number, attacker: Unit) {
    // <攻擊者> 對 <角色> 造成 <傷害值> 點傷害。
    console.log(
      `${attacker.getLogName()} 對 ${this.getLogName()} 造成 ${damage} 點傷害。`,
    )

    const newHp = Math.max(this.hp - damage, 0)
    this.setHp(newHp)
    if (this.getHp() <= 0) {
      this.die()
    }
  }

  loseHp(amount: number) {
    const newHp = Math.max(this.hp - amount, 0)
    this.setHp(newHp)
    if (this.getHp() <= 0) {
      this.die()
    }
  }

  applyCurseEffect(curseEffect: CurseEffect) {
    this.curseEffects.push(curseEffect)
  }

  heal(amount: number) {
    this.setHp(this.getHp() + amount)
  }

  consumeMp(amount: number) {
    const newMp = Math.max(this.mp - amount, 0)
    this.setMp(newMp)
  }

  decreaseStatusTurnsLeft() {
    this.statusTurnsLeft--
    if (this.statusTurnsLeft <= 0) {
      this.enterStatus(new NormalUnitStatus())
    }
  }

  hasEnoughMp(amount: number) {
    return this.getMp() >= amount
  }

  die() {
    // <目標> 死亡。
    console.log(`${this.getLogName()} 死亡。`)

    this.notifyDeath()
  }

  notifyDeath() {
    this.deathObservers.forEach((observer) => {
      observer.onUnitDead(this)
    })
  }

  removeDeathObserver(observer: DeathObserver) {
    this.deathObservers = this.deathObservers.filter((o) => o !== observer)
  }

  spendMp(amount: number) {
    this.consumeMp(amount)
  }

  isCursedBy(caster: Unit): boolean {
    return this.curseEffects.some((effect) => effect.getCaster() === caster)
  }

  tickStatus() {
    this.decreaseStatusTurnsLeft()
  }

  resolveStatus(): boolean {
    return this.status.resolveStatus(this)
  }
  receiveOnePunch(attacker: Unit): void {
    this.status.onReceiveOnePunch(this, attacker)
  }

  abstract chooseAction(): Promise<AttackAction>
  abstract chooseTargets(
    candidates: Unit[],
    targetCount: number,
  ): Promise<Unit[]>
}
