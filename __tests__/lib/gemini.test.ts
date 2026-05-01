jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: () => JSON.stringify({ key: 'value' }),
        },
      }),
    }),
  })),
}))

import { generateJSON } from '@/lib/gemini'

describe('generateJSON', () => {
  it('returns parsed JSON from Gemini response', async () => {
    const result = await generateJSON('test prompt')
    expect(result).toEqual({ key: 'value' })
  })
})
