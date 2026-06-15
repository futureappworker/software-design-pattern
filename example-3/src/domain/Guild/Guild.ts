import type { Hero } from '../Hero/Hero'

type GuildProps = {
  id: string
  name: string
  members: Hero[]
}

export class Guild {
  private id!: string
  private name!: string
  private members: Hero[] = []

  constructor({ id, name, members }: GuildProps) {
    this.setId(id)
    this.setName(name)
    this.setMembers(members)
  }

  getId() {
    return this.id
  }
  private setId(id: string) {
    this.id = id
  }

  getName() {
    return this.name
  }
  private setName(name: string) {
    this.name = name
  }

  getMembers() {
    return [...this.members]
  }
  private setMembers(members: Hero[]) {
    if (members.length < 1 || members.length > 10) {
      throw new Error('公會最少需要 1 人, 最多 10 人')
    }

    for (const hero of members) {
      this.join(hero)
      hero.joinGuild(this)
    }
  }

  join(member: Hero) {
    const exists = this.members.some((hero) => hero.getId() === member.getId())

    if (exists) {
      throw new Error('hero 已經在公會裡')
    }

    if (this.getMembers().length === 10) {
      throw new Error('公會最多 10 人, 現在已滿人')
    }

    this.members.push(member)
  }

  leave(member: Hero) {
    const exists = this.members.some((hero) => hero.getId() === member.getId())

    if (!exists) {
      throw new Error('這個 hero 本來就不在公會裡')
    }

    if (this.getMembers().length === 1) {
      throw new Error('公會最少需要 1 人, 現在剩 1 人')
    }

    this.members = this.members.filter(
      (hero) => hero.getId() !== member.getId(),
    )
  }
}
