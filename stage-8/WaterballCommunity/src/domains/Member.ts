import { shouldBeWithinRange } from '../utils/shouldBeWithinRange'

type MemberProps = {
  id: string
  role?: MemberRole
  isOnline?: boolean
}

export enum MemberRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export class Member {
  private id!: string
  private role: MemberRole = MemberRole.MEMBER
  private isOnline: boolean = false
  private lastLoggedInAt: Date | null = null

  constructor({ id, role = MemberRole.MEMBER, isOnline = false }: MemberProps) {
    this.setId(id)
    this.setRole(role)
    this.setIsOnline(isOnline)
  }

  getId(): string {
    return this.id
  }

  setId(id: string): void {
    // id 1~20 字元
    shouldBeWithinRange({
      name: 'id 的範圍',
      num: id.length,
      inclusiveMin: 1,
      inclusiveMax: 20,
    })
    this.id = id
  }

  getRole(): MemberRole {
    return this.role
  }

  setRole(role: MemberRole): void {
    this.role = role
  }

  getIsOnline(): boolean {
    return this.isOnline
  }

  private setIsOnline(isOnline: boolean): void {
    this.isOnline = isOnline
  }

  isAdmin(): boolean {
    return this.role === MemberRole.ADMIN
  }

  getLastLoggedInAt(): Date | null {
    return this.lastLoggedInAt ? new Date(this.lastLoggedInAt) : null
  }

  private setLastLoggedInAt(date: Date) {
    this.lastLoggedInAt = date
  }

  login(): void {
    this.setIsOnline(true)
    this.setLastLoggedInAt(new Date())
  }

  logout(): void {
    this.setIsOnline(false)
  }
}
