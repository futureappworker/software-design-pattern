import { nanoid } from 'nanoid'
import { describe, expect, it } from 'vitest'
import { Hero } from '../../Hero/Hero'
import { Guild } from '../Guild'
import { JoinUseCase } from './Join.usecase'

describe('join.usecase', () => {
  it('當 Hero 還沒加入 Guild 時, 應該能成功加入', () => {
    const heroA = new Hero({
      id: nanoid(),
    })
    const heroB = new Hero({
      id: nanoid(),
    })
    const guild = new Guild({
      id: nanoid(),
      name: 'Kind',
      members: [heroB],
    })

    const joinUseCase = new JoinUseCase()

    joinUseCase.execute({
      hero: heroA,
      guild,
    })

    expect(guild.getMembers()).toContain(heroA)
    expect(heroA.getGuilds()).toContain(guild)
  })
})
