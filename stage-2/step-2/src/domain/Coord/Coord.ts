type CoordProps = {
  x: number
  y: number
}

export class Coord {
  private x: number
  private y: number

  constructor({ x, y }: CoordProps) {
    this.x = x
    this.y = y
  }

  getX() {
    return this.x
  }

  getY() {
    return this.y
  }
}
