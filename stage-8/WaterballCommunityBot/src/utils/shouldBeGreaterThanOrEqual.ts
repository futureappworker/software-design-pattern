type shouldBeGreaterThanOrEqualProps = {
  name: string
  num: number
  target: number
}

export function shouldBeGreaterThanOrEqual({
  name,
  num,
  target,
}: shouldBeGreaterThanOrEqualProps) {
  if (num < target) {
    throw new Error(`${name} must be greater than or equal ${target}`)
  }
}
