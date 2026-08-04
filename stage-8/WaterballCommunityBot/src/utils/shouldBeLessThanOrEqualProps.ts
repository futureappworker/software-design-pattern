type shouldBeLessThanOrEqualProps = {
  name: string
  num: number
  target: number
}

export function shouldBeLessThanOrEqual({
  name,
  num,
  target,
}: shouldBeLessThanOrEqualProps) {
  if (num > target) {
    throw new Error(`${name} must be less than or equal ${target}`)
  }
}
