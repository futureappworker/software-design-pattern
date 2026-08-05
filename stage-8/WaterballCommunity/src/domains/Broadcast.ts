import type { Member } from './Member'
import type { WaterballCommunity } from './WaterballCommunity'

type BroadcastProps = {
  isActive?: boolean
  speaker?: Member | null
}

export class Broadcast {
  private isActive: boolean = false
  private speaker: Member | null = null
  private contents: string[] = []

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

  getContents(): string[] {
    return [...this.contents]
  }

  setContents(contents: string[]): void {
    this.contents = [...contents]
  }

  private addContent(content: string): void {
    this.contents.push(content)
  }

  goBroadcasting(speaker: Member): void {
    this.setIsActive(true)
    this.setSpeaker(speaker)
  }

  stopBroadcasting(): void {
    this.setIsActive(false)
    this.setSpeaker(null)
  }

  speak(content: string): void {
    // 必須 已開始廣播
    if (!this.getIsActive()) {
      throw new Error('尚未開始廣播')
    }

    // 必須 有講者
    if (!this.getSpeaker()) {
      throw new Error('尚未有講者')
    }

    const speakerId = this.getSpeaker()?.getId()

    this.addContent(content)
    console.log(`📢 ${speakerId}: ${content}`)
  }

  recordReplay(waterballCommunity: WaterballCommunity) {
    const botId = waterballCommunity.getBot().getId()
    const speakerId = this.getSpeaker()?.getId()
    if (!speakerId) {
      throw new Error('尚未有講者')
    }
    const contentsString = this.getContents().join('\n')

    waterballCommunity.sendMessage({
      authorId: botId,
      content: `[Record Replay] ${contentsString}`,
      tags: [speakerId],
    })
  }
}
