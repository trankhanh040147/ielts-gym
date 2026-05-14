import { NextRequest, NextResponse } from 'next/server'
import { generateJSON } from '@/lib/gemini'
import { DebateOpenerSchema } from '@/lib/schemas'
import { createFallbackDebateOpener } from '@/lib/mock-data'

const PROMPT_TEMPLATE = (task: string) => `You are an IELTS Writing Task 2 coach helping a band 5.5-6.5 learner develop their ideas.

Given this IELTS Task 2 prompt, start a focused debate to help the learner choose their position.

Task prompt: "${task}"

Respond with ONLY valid JSON:
{
  "topic_summary": "one sentence restating what the essay is about",
  "question": "a short question asking which side they lean toward",
  "position_options": ["option 1", "option 2", "option 3"]
}

Rules:
- position_options: exactly 2-3 short phrases, each under 12 words
- Use plain English for a band 5.5-6.5 learner
- Do not add any text outside the JSON`

export async function POST(request: NextRequest) {
  let body: { prompt?: string } | undefined

  try {
    body = await request.json()
    const { prompt = '' } = body ?? {}
    const raw = await generateJSON(PROMPT_TEMPLATE(prompt))
    const parsed = DebateOpenerSchema.parse(raw)
    return NextResponse.json(parsed)
  } catch {
    return NextResponse.json(createFallbackDebateOpener(body?.prompt))
  }
}
