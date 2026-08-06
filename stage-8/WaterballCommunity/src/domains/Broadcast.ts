type BroadcastProps = {
  isRecording?: boolean
  speakerId?: string | null
  recorderId?: string | null
}

export class Broadcast {
  private isRecording: boolean = false
  private speakerId: string | null = null
  private recorderId: string | null = null
  private records: string[] = []

  constructor({
    isRecording = false,
    speakerId = null,
    recorderId = null,
  }: BroadcastProps) {
    this.setIsRecording(isRecording)
    this.setSpeakerId(speakerId)
    this.setRecorderId(recorderId)
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

  getRecorderId(): string | null {
    return this.recorderId
  }

  setRecorderId(recorderId: string | null): void {
    this.recorderId = recorderId
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
  }

  stopBroadcasting({ speakerId }: { speakerId: string }): void {
    if (speakerId !== this.speakerId) {
      return
    }

    this.speakerId = null
  }

  recordReplay() {
    console.log(
      `🤖: [Record Replay] ${this.records.join('\n')} @${this.recorderId}`,
    )
  }

  speak({ speakerId, content }: { speakerId: string; content: string }): void {
    if (speakerId !== this.speakerId) {
      return
    }

    if (this.isRecording) {
      this.addRecord(content)
    }
  }
}
