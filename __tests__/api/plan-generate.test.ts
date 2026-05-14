/**
 * @jest-environment node
 */
jest.mock('@/lib/gemini', () => ({ generateJSON: jest.fn() }))
import { generateJSON } from '@/lib/gemini'
const mockGen = generateJSON as jest.Mock

import { POST } from '@/app/api/plan/generate/route'

const post = (req: Request) => POST(req as unknown as Parameters<typeof POST>[0])

describe('POST /api/plan/generate', () => {
  beforeEach(() => {
    mockGen.mockReset()
  })

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
    const res = await post(req)
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
    const res = await post(req)
    const data = await res.json()
    expect(data.position).toBeDefined()
    expect(data.body.length).toBeGreaterThan(0)
  })

  it('falls back to a plan that preserves the learner position and argument', async () => {
    mockGen.mockRejectedValue(new Error('fail'))
    const req = new Request('http://localhost/api/plan/generate', {
      method: 'POST',
      body: JSON.stringify({
        prompt: 'test',
        position: 'Students should focus on practical, job-ready subjects',
        argument: 'Adaptability prepares students for an uncertain job market',
      }),
    })
    const res = await post(req)
    const data = await res.json()
    expect(data.position).toBe('Students should focus on practical, job-ready subjects')
    expect(data.thesis).toContain('adaptability')
    expect(data.body[0].argument).toContain('Adaptability')
    expect(data.body[1].argument).toContain('this position')
    expect(data.concession).toContain('opposite view')
    expect(JSON.stringify(data)).not.toContain('free to choose subjects')
    expect(JSON.stringify(data)).not.toContain('passions')
  })

  it('does not hard-code the practical-subject side for other learner positions', async () => {
    mockGen.mockRejectedValue(new Error('fail'))
    const req = new Request('http://localhost/api/plan/generate', {
      method: 'POST',
      body: JSON.stringify({
        prompt: 'test',
        position: 'Students should freely choose subjects they enjoy',
        argument: 'Motivation helps students learn more deeply',
      }),
    })
    const res = await post(req)
    const data = await res.json()
    const serialized = JSON.stringify(data)
    expect(data.position).toBe('Students should freely choose subjects they enjoy')
    expect(serialized).toContain('Motivation')
    expect(serialized).not.toContain('Practical university study')
    expect(serialized).not.toContain('workplace-ready')
  })

  it('falls back to mock plan when request body is malformed', async () => {
    const req = new Request('http://localhost/api/plan/generate', {
      method: 'POST',
      body: '{',
    })
    const res = await post(req)
    const data = await res.json()
    expect(data.position).toBeDefined()
    expect(data.body.length).toBeGreaterThan(0)
  })
})
