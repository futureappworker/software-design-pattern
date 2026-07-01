// 範例輸入: normal-no-error-play1.in
// 範例輸出: normal-no-error-play1.out

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

describe('normal-no-error-play1 scenario', () => {
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
    const { deckCards, playerNames, actions } = parseScenarioInput(
      'normal-no-error-play1',
    )
    const expectedOutput = readScenarioOutput('normal-no-error-play1')

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
