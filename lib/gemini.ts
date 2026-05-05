import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')

export async function generateJSON(prompt: string): Promise<unknown> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-3-flash-preview',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.7,
    },
  })
  const result = await model.generateContent(prompt)
  const text = result.response.text()
  return JSON.parse(text)
}
