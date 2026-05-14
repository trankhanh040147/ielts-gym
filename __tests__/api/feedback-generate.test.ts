/**
 * @jest-environment node
 */
jest.mock('@/lib/gemini', () => ({ generateJSON: jest.fn() }))
import { generateJSON } from '@/lib/gemini'
const mockGen = generateJSON as jest.Mock

import { POST } from '@/app/api/feedback/generate/route'

const post = (req: Request) => POST(req as unknown as Parameters<typeof POST>[0])

describe('POST /api/feedback/generate', () => {
  beforeEach(() => {
    mockGen.mockReset()
  })

  const validFeedback = {
    band_estimate: '6.0-6.5',
    top_issues: [
      {
        title: 'Unclear topic sentences',
        why_it_matters: 'They make paragraph purpose hard to follow.',
        fix: 'Start each body paragraph with one direct claim.',
      },
    ],
    rewrite_sample: 'Practical education can help students adapt to changing work demands.',
    next_actions: ['Rewrite both topic sentences.'],
  }

  it('returns structured feedback when AI succeeds', async () => {
    mockGen.mockResolvedValue(validFeedback)
    const req = new Request('http://localhost/api/feedback/generate', {
      method: 'POST',
      body: JSON.stringify({
        prompt: 'test prompt',
        plan: { thesis: 'test thesis' },
        essay: 'This is a complete learner essay with enough words to evaluate.',
      }),
    })
    const res = await post(req)
    const data = await res.json()
    expect(data.band_estimate).toBe('6.0-6.5')
    expect(data.top_issues[0].title).toBe('Unclear topic sentences')
  })

  it('falls back to mock feedback when AI fails', async () => {
    mockGen.mockRejectedValue(new Error('AI error'))
    const req = new Request('http://localhost/api/feedback/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt: 'test prompt', plan: {}, essay: 'test essay' }),
    })
    const res = await post(req)
    const data = await res.json()
    expect(data.band_estimate).toBeDefined()
    expect(data.top_issues.length).toBeGreaterThan(0)
  })

  it('falls back to mock feedback when request body is malformed', async () => {
    const req = new Request('http://localhost/api/feedback/generate', {
      method: 'POST',
      body: '{',
    })
    const res = await post(req)
    const data = await res.json()
    expect(data.band_estimate).toBeDefined()
    expect(data.next_actions.length).toBeGreaterThan(0)
  })
})
