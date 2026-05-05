/**
 * @jest-environment node
 */
jest.mock('@/lib/gemini', () => ({ generateJSON: jest.fn() }))
import { generateJSON } from '@/lib/gemini'
const mockGen = generateJSON as jest.Mock

import { POST } from '@/app/api/debate/open/route'

describe('POST /api/debate/open', () => {
  const validOpener = {
    topic_summary: 'Test summary.',
    question: 'Which side?',
    position_options: ['A', 'B'],
  }

  it('returns DebateOpener when AI succeeds', async () => {
    mockGen.mockResolvedValue(validOpener)
    const req = new Request('http://localhost/api/debate/open', {
      method: 'POST',
      body: JSON.stringify({ prompt: 'test prompt' }),
    })
    const res = await POST(req as any)
    const data = await res.json()
    expect(data.topic_summary).toBe('Test summary.')
    expect(data.position_options).toHaveLength(2)
  })

  it('falls back to mock data when AI throws', async () => {
    mockGen.mockRejectedValue(new Error('AI error'))
    const req = new Request('http://localhost/api/debate/open', {
      method: 'POST',
      body: JSON.stringify({ prompt: 'test prompt' }),
    })
    const res = await POST(req as any)
    const data = await res.json()
    expect(data.topic_summary).toBeDefined()
    expect(Array.isArray(data.position_options)).toBe(true)
  })

  it('falls back to mock data when AI returns invalid JSON shape', async () => {
    mockGen.mockResolvedValue({ wrong_field: 'oops' })
    const req = new Request('http://localhost/api/debate/open', {
      method: 'POST',
      body: JSON.stringify({ prompt: 'test prompt' }),
    })
    const res = await POST(req as any)
    const data = await res.json()
    expect(data.position_options).toBeDefined()
  })
})
