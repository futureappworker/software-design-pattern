// 範例輸入: illegal-actions.in
// 範例輸出: illegal-actions.out

import { createInterface } from 'node:readline/promises'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Human } from '../domain/Player/Human/Human'
import {
  createBig2,
  parseScenarioInput,
  readScenarioOutput,
} from './scenarioTestUtils'

vi.mock('node:readline/promises', () => ({
  createInterface: vi.fn(),
}))

describe('illegal-actions scenario', () => {
  const mockQuestion = vi.fn()

  beforeEach(() => {
    vi.mocked(createInterface).mockReturnValue({
      question: mockQuestion,
      close: vi.fn(),
    } as never)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    mockQuestion.mockReset()
  })

  it('should match the expected game output', async () => {
    const { deckCards, playerNames, actions } =
      parseScenarioInput('illegal-actions')
    const expectedOutput = readScenarioOutput('illegal-actions')

    for (const action of actions) {
      mockQuestion.mockResolvedValueOnce(action)
    }

    const players = playerNames.map((name: string) => new Human({ name }))
    const big2 = createBig2(deckCards, players)

    const outputLines: string[] = []
    vi.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
      outputLines.push(args.map(String).join(' '))
    })

    await big2.start()

    expect(outputLines.join('\n')).toBe(expectedOutput)
  })
})
