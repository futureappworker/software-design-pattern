type shouldBeAlphanumericOrChineseProps = {
  name: string
  str: string
}

const alphanumericOrChinesePattern = /^[A-Za-z0-9\u4e00-\u9fff]+$/

export function shouldBeAlphanumericOrChinese({
  name,
  str,
}: shouldBeAlphanumericOrChineseProps) {
  if (!alphanumericOrChinesePattern.test(str)) {
    throw new Error(
      `${name} must consist of letters, numbers, or Chinese characters`,
    )
  }
}
