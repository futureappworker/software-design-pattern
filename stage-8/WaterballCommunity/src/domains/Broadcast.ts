import type { Member } from './Member'

type BroadcastProps = {
  isActive?: boolean
  speaker?: Member | null
}

export class Broadcast {
  private isActive: boolean = false
  private speaker: Member | null = null

  constructor({ isActive = false, speaker = null }: BroadcastProps) {
    this.setIsActive(isActive)
    this.setSpeaker(speaker)
  }

  getIsActive(): boolean {
    return this.isActive
  }

  setIsActive(isActive: boolean): void {
    this.isActive = isActive
  }

  getSpeaker(): Member | null {
    return this.speaker
  }

  setSpeaker(speaker: Member | null): void {
    this.speaker = speaker
  }

  goBroadcasting(speaker: Member): void {
    this.setIsActive(true)
    this.setSpeaker(speaker)
  }

  stopBroadcasting(): void {
    this.setIsActive(false)
    this.setSpeaker(null)
  }

  speak(_message: string): void {
    // 必須 已開始廣播
    if (!this.getIsActive()) {
      throw new Error('尚未開始廣播')
    }

    // 必須 有講者
    if (!this.getSpeaker()) {
      throw new Error('尚未有講者')
    }

    // TODO
  }
}
