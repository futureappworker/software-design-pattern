import type { Hero } from '../../Hero/Hero'
import type { Guild } from '../Guild'

type Input = {
  hero: Hero
  guild: Guild
}

export class LeaveUseCase {
  execute({ hero, guild }: Input) {
    guild.leave(hero)
    hero.leaveGuild(guild)
  }
}
