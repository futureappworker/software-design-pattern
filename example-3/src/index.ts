import { nanoid } from 'nanoid'
import { Guild } from './domain/Guild/Guild'
import { JoinUseCase } from './domain/Guild/usecases/Join.usecase'
import { LeaveUseCase } from './domain/Guild/usecases/Leave.usecase'
import { Hero } from './domain/Hero/Hero'

const heroA = new Hero({
  id: nanoid(),
})
const heroB = new Hero({
  id: nanoid(),
})
const heroC = new Hero({
  id: nanoid(),
})
const guild = new Guild({
  id: nanoid(),
  name: 'King',
  members: [heroA],
})

console.log(`初始成員數量: ${guild.getMembers().length}\n`)

const joinUseCase = new JoinUseCase()

joinUseCase.execute({
  hero: heroB,
  guild,
})

console.log(`HeroB 加入, 成員數量: ${guild.getMembers().length}\n`)

joinUseCase.execute({
  hero: heroC,
  guild,
})

console.log(`HeroC 加入, 成員數量: ${guild.getMembers().length}\n`)

try {
  joinUseCase.execute({
    hero: heroA,
    guild,
  })
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message, '\n')
  } else {
    console.log('Unknown error:', error, '\n')
  }
}

const leaveUseCase = new LeaveUseCase()

leaveUseCase.execute({
  hero: heroA,
  guild,
})
console.log(`HeroA 離開, 成員數量: ${guild.getMembers().length}\n`)

leaveUseCase.execute({
  hero: heroB,
  guild,
})
console.log(`HeroB 離開, 成員數量: ${guild.getMembers().length}\n`)

try {
  leaveUseCase.execute({
    hero: heroC,
    guild,
  })
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message, '\n')
  } else {
    console.log('Unknown error:', error, '\n')
  }
}

try {
  leaveUseCase.execute({
    hero: heroA,
    guild,
  })
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message, '\n')
  } else {
    console.log('Unknown error:', error, '\n')
  }
}
