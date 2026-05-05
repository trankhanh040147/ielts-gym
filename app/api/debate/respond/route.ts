import { NextRequest, NextResponse } from 'next/server'
import { generateJSON } from '@/lib/gemini'
import { DebateFollowUpSchema } from '@/lib/schemas'
import { MOCK_DEBATE_FOLLOW_UP } from '@/lib/mock-data'

const PROMPT_TEMPLATE = (task: string, position: string) =>
  `You are an IELTS Writing Task 2 coach.

The learner is working on: "${task}"
They chose this position: "${position}"

Acknowledge their choice in one encouraging sentence, then ask one focused question to help them identify their strongest argument.

Respond with ONLY valid JSON:
{
  "acknowledgment": "one encouraging sentence affirming their choice",
  "question": "one question asking for their main argument or reason",
  "argument_hints": ["hint 1", "hint 2", "hint 3"]
}

Rules:
- argument_hints: exactly 2-3 short phrases suggesting possible arguments
- Use plain English for a band 5.5-6.5 learner
- Do not add any text outside the JSON`

export async function POST(request: NextRequest) {
  const { prompt, position } = await request.json()

  try {
    const raw = await generateJSON(PROMPT_TEMPLATE(prompt, position))
    const parsed = DebateFollowUpSchema.parse(raw)
    return NextResponse.json(parsed)
  } catch {
    return NextResponse.json(MOCK_DEBATE_FOLLOW_UP)
  }
}
