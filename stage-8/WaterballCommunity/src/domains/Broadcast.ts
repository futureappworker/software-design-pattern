type BroadcastProps = {
  isRecording?: boolean
  speakerId?: string | null
}

export class Broadcast {
  private isRecording: boolean = false
  private speakerId: string | null = null
  private records: string[] = []

  constructor({ isRecording = false, speakerId = null }: BroadcastProps) {
    this.setIsRecording(isRecording)
    this.setSpeakerId(speakerId)
  }

  getIsRecording(): boolean {
    return this.isRecording
  }

  setIsRecording(isRecording: boolean): void {
    this.isRecording = isRecording
  }

  getSpeakerId(): string | null {
    return this.speakerId
  }

  setSpeakerId(speakerId: string | null): void {
    this.speakerId = speakerId
  }

  getRecords(): string[] {
    return [...this.records]
  }

  setRecords(records: string[]): void {
    this.records = [...records]
  }

  addRecord(record: string): void {
    this.records.push(record)
  }

  goBroadcasting({ speakerId }: { speakerId: string }): void {
    this.speakerId = speakerId
    console.log(`📢 ${speakerId} is broadcasting...`)
  }

  stopBroadcasting({ speakerId }: { speakerId: string }): void {
    if (speakerId !== this.speakerId) {
      return
    }

    this.speakerId = null
    console.log(`📢 ${speakerId} stop broadcasting`)
  }

  recordReplay() {
    console.log(
      `🤖: [Record Replay] ${this.records.join('\n')} @${this.speakerId}`,
    )
  }

  speak({
    isBot,
    speakerId,
    content,
  }: {
    isBot: boolean
    speakerId: string
    content: string
  }): void {
    if (speakerId !== this.speakerId) {
      return
    }

    if (!isBot) {
      console.log(`📢 ${speakerId}: ${content}`)
    }

    if (isBot) {
      console.log(`🤖 speaking: ${content}`)
    }

    if (this.isRecording) {
      this.addRecord(content)
    }
  }
}
