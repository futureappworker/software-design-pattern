type assertWithinRangeProps = {
  name: string
  num: number
  min: number
  max: number
}

export function assertWithinRange({
  name,
  num,
  min,
  max,
}: assertWithinRangeProps) {
  if (min > max) {
    throw new Error('min 必須小於等於 max')
  }

  if (num < min || num > max) {
    throw new Error(`${name} 必須介於 ${min}~${max}`)
  }
}
