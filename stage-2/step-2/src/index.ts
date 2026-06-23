import { Coord } from './domain/Coord/Coord'
import { Gender } from './domain/Individual/Gender'
import { Habit } from './domain/Individual/Habit'
import { Individual } from './domain/Individual/Individual'
import { MatchmakingSystem } from './domain/MatchmakingSystem/MatchmakingSystem'
import { HabitBasedMatchingStrategy } from './domain/MatchmakingSystem/matchingStrategys/HabitBasedMatchingStrategy/HabitBasedMatchingStrategy'

const individuals = [
  new Individual({
    id: 1,
    gender: Gender.MALE,
    age: 25,
    coord: new Coord({ x: 0, y: 0 }),
    intro: '喜歡打籃球',
    habits: [Habit.BASKETBALL, Habit.GAMING],
  }),
  new Individual({
    id: 2,
    gender: Gender.FEMALE,
    age: 22,
    coord: new Coord({ x: 3, y: 4 }),
    intro: '熱愛煮菜',
    habits: [Habit.COOKING, Habit.BASKETBALL],
  }),
  new Individual({
    id: 3,
    gender: Gender.MALE,
    age: 30,
    coord: new Coord({ x: 10, y: 2 }),
    intro: '遊戲玩家',
    habits: [Habit.GAMING, Habit.COOKING],
  }),
  new Individual({
    id: 4,
    gender: Gender.FEMALE,
    age: 28,
    coord: new Coord({ x: 1, y: 1 }),
    intro: '運動與美食',
    habits: [Habit.BASKETBALL, Habit.COOKING, Habit.GAMING],
  }),
  new Individual({
    id: 5,
    gender: Gender.MALE,
    age: 35,
    coord: new Coord({ x: 5, y: 5 }),
    intro: '只愛打籃球',
    habits: [Habit.BASKETBALL],
  }),
  new Individual({
    id: 6,
    gender: Gender.FEMALE,
    age: 20,
    coord: new Coord({ x: 8, y: 6 }),
    intro: '喜歡玩遊戲',
    habits: [Habit.GAMING],
  }),
  new Individual({
    id: 7,
    gender: Gender.MALE,
    age: 27,
    coord: new Coord({ x: 2, y: 8 }),
    intro: '煮菜達人',
    habits: [Habit.COOKING, Habit.GAMING],
  }),
  new Individual({
    id: 8,
    gender: Gender.FEMALE,
    age: 24,
    coord: new Coord({ x: 6, y: 3 }),
    intro: '籃球與遊戲',
    habits: [Habit.BASKETBALL, Habit.GAMING],
  }),
  new Individual({
    id: 9,
    gender: Gender.MALE,
    age: 32,
    coord: new Coord({ x: 12, y: 9 }),
    intro: '三項全能',
    habits: [Habit.BASKETBALL, Habit.COOKING, Habit.GAMING],
  }),
  new Individual({
    id: 10,
    gender: Gender.FEMALE,
    age: 26,
    coord: new Coord({ x: 4, y: 7 }),
    intro: '喜歡煮菜與打籃球',
    habits: [Habit.COOKING, Habit.BASKETBALL],
  }),
]

const matchmakingSystem = new MatchmakingSystem({
  matchingStrategy: new HabitBasedMatchingStrategy(),
})

const result = matchmakingSystem.match(individuals)
console.log(result)
