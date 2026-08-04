type ShouldNotBeNullProps<T> = {
  name: string
  obj: T | null
}

export function shouldNotBeNull<T>({ name, obj }: ShouldNotBeNullProps<T>) {
  if (obj === null) {
    throw new Error(`${name} must not be null`)
  }
}
