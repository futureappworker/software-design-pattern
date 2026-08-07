import { vi } from 'vitest'

export enum TimeUnit {
  seconds = 'seconds',
  minutes = 'minutes',
  hours = 'hours',
}

type TimeElapsedProps = {
  n: number
  unit: TimeUnit
}

export function timeElapsed({ n, unit }: TimeElapsedProps) {
  console.log(`🕑 ${n} ${unit} elapsed...`)

  let milliseconds = 0
  switch (unit) {
    case TimeUnit.seconds:
      milliseconds = n * 1000
      break
    case TimeUnit.minutes:
      milliseconds = n * 60_000
      break
    case TimeUnit.hours:
      milliseconds = n * 3_600_000
      break
  }

  vi.advanceTimersByTime(milliseconds)
}
