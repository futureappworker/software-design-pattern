import { describe, expect, it } from 'vitest'
import { Coord } from '../../../Coord/Coord'
import { Gender } from '../../../Individual/Gender'
import { Individual } from '../../../Individual/Individual'
import { DistanceBasedMatchingStrategy } from './DistanceBasedMatchingStrategy'

describe('DistanceBasedMatchingStrategy', () => {
  const strategy = new DistanceBasedMatchingStrategy()

  const createIndividual = (id: number, x: number, y: number) =>
    new Individual({
      id,
      gender: Gender.MALE,
      age: 18,
      coord: new Coord({ x, y }),
    })

  describe('match', () => {
    // 驗證沒有個體時回傳空陣列
    it('should return empty array when individuals is empty', () => {
      expect(strategy.match([])).toEqual([])
    })

    // 驗證只有一個個體時候選人為空
    it('should return empty candidateIds when only one individual', () => {
      const individuals = [createIndividual(1, 0, 0)]

      expect(strategy.match(individuals)).toEqual([
        { individualId: 1, candidateIds: [] },
      ])
    })

    // 驗證候選人依距離由近到遠排序
    it('should sort candidates by distance ascending', () => {
      const individuals = [
        createIndividual(1, 0, 0),
        createIndividual(2, 3, 4),
        createIndividual(3, 1, 0),
      ]

      const result = strategy.match(individuals)

      expect(result.find((r) => r.individualId === 1)?.candidateIds).toEqual([
        3, 2,
      ])
    })

    // 驗證距離相同時依 id 由小到大排序
    it('should sort by id when distance is equal', () => {
      const individuals = [
        createIndividual(1, 0, 0),
        createIndividual(3, 1, 0),
        createIndividual(2, 0, 1),
      ]

      const result = strategy.match(individuals)

      expect(result.find((r) => r.individualId === 1)?.candidateIds).toEqual([
        2, 3,
      ])
    })

    // 驗證候選人不包含自己
    it('should not include self in candidate list', () => {
      const individuals = [createIndividual(1, 0, 0), createIndividual(2, 1, 1)]

      const result = strategy.match(individuals)

      result.forEach((ranking) => {
        expect(ranking.candidateIds).not.toContain(ranking.individualId)
      })
    })
  })
})
