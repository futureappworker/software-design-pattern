type shouldBeWithinRangeProps = {
  name: string
  num: number
  inclusiveMin: number
  inclusiveMax: number
}

export function shouldBeWithinRange({
  name,
  num,
  inclusiveMin,
  inclusiveMax,
}: shouldBeWithinRangeProps) {
  if (num < inclusiveMin || num > inclusiveMax) {
    throw new Error(
      `${name} must be within the range: ${inclusiveMin}~${inclusiveMax}`,
    )
  }
}
