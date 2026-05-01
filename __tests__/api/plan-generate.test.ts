/**
 * @jest-environment node
 */
jest.mock('@/lib/gemini', () => ({ generateJSON: jest.fn() }))
import { generateJSON } from '@/lib/gemini'
const mockGen = generateJSON as jest.Mock

import { POST } from '@/app/api/plan/generate/route'

describe('POST /api/plan/generate', () => {
  const validPlan = {
    position: 'Students should study freely.',
    thesis: 'Free choice produces better graduates.',
    body: [
      { label: 'Body Paragraph 1', argument: 'Motivation.', support: 'Support.', example: 'Example.' },
      { label: 'Body Paragraph 2', argument: 'Innovation.', support: 'Support.', example: 'Example.' },
    ],
    writing_tips: ['tip one', 'tip two'],
  }

  it('returns EssayPlan when AI succeeds', async () => {
    mockGen.mockResolvedValue(validPlan)
    const req = new Request('http://localhost/api/plan/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt: 'test', position: 'agree', argument: 'motivation' }),
    })
    const res = await POST(req as any)
    const data = await res.json()
    expect(data.thesis).toBe('Free choice produces better graduates.')
    expect(data.body).toHaveLength(2)
  })

  it('falls back to mock plan when AI fails', async () => {
    mockGen.mockRejectedValue(new Error('fail'))
    const req = new Request('http://localhost/api/plan/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt: 'test', position: 'agree', argument: 'motivation' }),
    })
    const res = await POST(req as any)
    const data = await res.json()
    expect(data.position).toBeDefined()
    expect(data.body.length).toBeGreaterThan(0)
  })
})
