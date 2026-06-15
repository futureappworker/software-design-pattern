import { nanoid } from 'nanoid'
import { describe, expect, it } from 'vitest'
import { Hero } from '../../Hero/Hero'
import { Guild } from '../Guild'
import { JoinUseCase } from './Join.usecase'
import { LeaveUseCase } from './Leave.usecase'

describe('leave.usecase', () => {
  it('當離開 guild 時, 應該能成功離開', () => {
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

    const leaveUseCase = new LeaveUseCase()

    leaveUseCase.execute({
      hero: heroA,
      guild,
    })

    expect(guild.getMembers()).not.toContain(heroA)
    expect(heroA.getGuilds()).not.toContain(guild)
  })

  it('當離開 guild 時, 只剩最後一人, , 應該拋出錯誤', () => {
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

    const leaveUseCase = new LeaveUseCase()

    leaveUseCase.execute({
      hero: heroB,
      guild,
    })
    expect(() => {
      leaveUseCase.execute({
        hero: heroA,
        guild,
      })
    }).toThrow('公會最少需要 1 人, 現在剩 1 人')
  })

  it('當離開 guild 時, 本來就沒有這 hero, , 應該拋出錯誤', () => {
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

    const leaveUseCase = new LeaveUseCase()

    expect(() => {
      leaveUseCase.execute({
        hero: heroA,
        guild,
      })
    }).toThrow()
  })
})
