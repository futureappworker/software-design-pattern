import { stdin as input, stdout as output } from 'node:process'
import {
  createInterface,
  type Interface as ReadlineInterface,
} from 'node:readline/promises'

let readlineInterface: ReadlineInterface | null = null

export function getReadline() {
  if (!readlineInterface) {
    readlineInterface = createInterface({ input, output })
  }
  return readlineInterface
}

export function resetReadline() {
  readlineInterface = null
}
