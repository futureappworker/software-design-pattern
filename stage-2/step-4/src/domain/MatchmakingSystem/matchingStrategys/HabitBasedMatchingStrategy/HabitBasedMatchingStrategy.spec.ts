import { describe, expect, it } from 'vitest'
import { Coord } from '../../../Coord/Coord'
import { Gender } from '../../../Individual/Gender'
import { Habit } from '../../../Individual/Habit'
import { Individual } from '../../../Individual/Individual'
import { HabitBasedMatchingStrategy } from './HabitBasedMatchingStrategy'

describe('HabitBasedMatchingStrategy', () => {
  const strategy = new HabitBasedMatchingStrategy()

  const createIndividual = (id: number, habits: Habit[] = []) =>
    new Individual({
      id,
      gender: Gender.MALE,
      age: 18,
      coord: new Coord({ x: 0, y: 0 }),
      habits,
    })

  describe('match', () => {
    // 驗證沒有個體時回傳空陣列
    it('should return empty array when individuals is empty', () => {
      expect(strategy.match([])).toEqual([])
    })

    // 驗證只有一個個體時候選人為空
    it('should return empty candidateIds when only one individual', () => {
      const individuals = [createIndividual(1, [Habit.BASKETBALL])]

      expect(strategy.match(individuals)).toEqual([
        { individualId: 1, candidateIds: [] },
      ])
    })

    // 驗證候選人依共同興趣數量由多到少排序
    it('should sort candidates by habit intersection count descending', () => {
      const individuals = [
        createIndividual(1, [Habit.BASKETBALL, Habit.GAMING]),
        createIndividual(2, [Habit.BASKETBALL, Habit.GAMING, Habit.COOKING]),
        createIndividual(3, [Habit.BASKETBALL]),
      ]

      const result = strategy.match(individuals)

      expect(result.find((r) => r.individualId === 1)?.candidateIds).toEqual([
        2, 3,
      ])
    })

    // 驗證共同興趣數量相同時依 id 由小到大排序
    it('should sort by id when habit intersection count is equal', () => {
      const individuals = [
        createIndividual(1, [Habit.BASKETBALL, Habit.GAMING]),
        createIndividual(3, [Habit.BASKETBALL]),
        createIndividual(2, [Habit.GAMING]),
      ]

      const result = strategy.match(individuals)

      expect(result.find((r) => r.individualId === 1)?.candidateIds).toEqual([
        2, 3,
      ])
    })

    // 驗證候選人不包含自己
    it('should not include self in candidate list', () => {
      const individuals = [
        createIndividual(1, [Habit.BASKETBALL]),
        createIndividual(2, [Habit.GAMING]),
      ]

      const result = strategy.match(individuals)

      result.forEach((ranking) => {
        expect(ranking.candidateIds).not.toContain(ranking.individualId)
      })
    })
  })
})
