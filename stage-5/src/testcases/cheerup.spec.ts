// 範例輸入: cheerup.in
// 範例輸出: cheerup.out

import { createInterface } from 'node:readline/promises'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { resetReadline } from '../utils/readline'
import { createRPGFromTestcase, readTestcaseOutput } from './testcaseUtils'

vi.mock('node:readline/promises', () => ({
  createInterface: vi.fn(),
}))

describe('cheerup testcase', () => {
  const mockQuestion = vi.fn()

  beforeEach(() => {
    resetReadline()
    vi.mocked(createInterface).mockReturnValue({
      question: mockQuestion,
      close: vi.fn(),
    } as never)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    mockQuestion.mockReset()
    resetReadline()
  })

  it('should match the expected game output', async () => {
    const { rpg, actions } = createRPGFromTestcase('cheerup')
    const expectedOutput = readTestcaseOutput('cheerup')

    for (const action of actions) {
      mockQuestion.mockResolvedValueOnce(action)
    }

    const outputLines: string[] = []
    vi.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
      outputLines.push(args.map(String).join(' '))
    })

    await rpg.battle()

    expect(outputLines.join('\n')).toBe(expectedOutput)
  })
})
