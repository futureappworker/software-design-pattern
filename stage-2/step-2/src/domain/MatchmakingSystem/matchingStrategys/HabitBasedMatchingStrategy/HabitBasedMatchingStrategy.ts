import type { Habit } from '../../../Individual/Habit'
import type { Individual } from '../../../Individual/Individual'
import type { MatchingResult, MatchingStrategy } from '../../MatchingStrategy'

export class HabitBasedMatchingStrategy implements MatchingStrategy {
  match(individuals: Individual[]): MatchingResult {
    return individuals.map((individual) => {
      const individualHabits = individual.getHabits()

      const candidateIds = individuals
        .filter((other) => other.getId() !== individual.getId())
        .sort((a, b) => {
          const intersectionA = this.getHabitIntersectionCount(
            individualHabits,
            a.getHabits(),
          )
          const intersectionB = this.getHabitIntersectionCount(
            individualHabits,
            b.getHabits(),
          )

          if (intersectionA !== intersectionB) {
            return intersectionB - intersectionA
          }

          return a.getId() - b.getId()
        })
        .map((other) => other.getId())

      return { individualId: individual.getId(), candidateIds }
    })
  }

  private getHabitIntersectionCount(habitsA: Habit[], habitsB: Habit[]) {
    return habitsA.filter((habit) => habitsB.includes(habit)).length
  }
}
