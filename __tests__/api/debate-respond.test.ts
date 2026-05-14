/**
 * @jest-environment node
 */
jest.mock('@/lib/gemini', () => ({ generateJSON: jest.fn() }))
import { generateJSON } from '@/lib/gemini'
const mockGen = generateJSON as jest.Mock

import { POST } from '@/app/api/debate/respond/route'

const post = (req: Request) => POST(req as unknown as Parameters<typeof POST>[0])

describe('POST /api/debate/respond', () => {
  beforeEach(() => {
    mockGen.mockReset()
  })

  const validFollowUp = {
    acknowledgment: 'That is a clear position.',
    question: 'What is your strongest reason?',
    argument_hints: ['Reason one', 'Reason two'],
  }

  it('returns DebateFollowUp when AI succeeds', async () => {
    mockGen.mockResolvedValue(validFollowUp)
    const req = new Request('http://localhost/api/debate/respond', {
      method: 'POST',
      body: JSON.stringify({ prompt: 'test prompt', position: 'agree' }),
    })
    const res = await post(req)
    const data = await res.json()
    expect(data.acknowledgment).toBe('That is a clear position.')
    expect(data.argument_hints).toHaveLength(2)
  })

  it('falls back to mock data when AI throws', async () => {
    mockGen.mockRejectedValue(new Error('AI error'))
    const req = new Request('http://localhost/api/debate/respond', {
      method: 'POST',
      body: JSON.stringify({ prompt: 'test prompt', position: 'Students should choose freely.' }),
    })
    const res = await post(req)
    const data = await res.json()
    expect(data.acknowledgment).toContain('Students should choose freely.')
    expect(Array.isArray(data.argument_hints)).toBe(true)
  })

  it('falls back to mock data when request body is malformed', async () => {
    const req = new Request('http://localhost/api/debate/respond', {
      method: 'POST',
      body: '{',
    })
    const res = await post(req)
    const data = await res.json()
    expect(data.acknowledgment).toBeDefined()
    expect(Array.isArray(data.argument_hints)).toBe(true)
  })
})
