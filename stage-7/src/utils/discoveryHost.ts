export function discoveryHost(ip: string): boolean {
  const isSuccess = Math.random() < 0.5
  if (isSuccess) {
    console.log(`Discovery ip ${ip} success`)
  } else {
    console.log(`Discovery ip ${ip} failed`)
  }
  // 隨機模擬成功或失敗
  return isSuccess
}
