import type { Hero } from '../../Hero/Hero'
import type { Guild } from '../Guild'

type Input = {
  hero: Hero
  guild: Guild
}

export class JoinUseCase {
  execute({ hero, guild }: Input) {
    guild.join(hero)
    hero.joinGuild(guild)
  }
}
