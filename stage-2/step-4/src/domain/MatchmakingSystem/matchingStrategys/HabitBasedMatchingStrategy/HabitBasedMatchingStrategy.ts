import type { Habit } from '../../../Individual/Habit'
import type { Individual } from '../../../Individual/Individual'
import { BaseMatchingStrategy } from '../BaseMatchingStrategy'

export class HabitBasedMatchingStrategy extends BaseMatchingStrategy {
  protected compareCandidates(
    individual: Individual,
    a: Individual,
    b: Individual,
  ) {
    const individualHabits = individual.getHabits()

    return (
      this.getHabitIntersectionCount(individualHabits, b.getHabits()) -
      this.getHabitIntersectionCount(individualHabits, a.getHabits())
    )
  }

  private getHabitIntersectionCount(habitsA: Habit[], habitsB: Habit[]) {
    return habitsA.filter((habit) => habitsB.includes(habit)).length
  }
}
