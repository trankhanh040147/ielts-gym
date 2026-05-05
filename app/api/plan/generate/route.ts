import { NextRequest, NextResponse } from 'next/server'
import { generateJSON } from '@/lib/gemini'
import { EssayPlanSchema } from '@/lib/schemas'
import { MOCK_ESSAY_PLAN } from '@/lib/mock-data'

const PROMPT_TEMPLATE = (task: string, position: string, argument: string) =>
  `You are an IELTS Writing Task 2 coach creating a structured essay plan for a band 5.5-6.5 learner.

Task prompt: "${task}"
Learner's position: "${position}"
Learner's main argument: "${argument}"

Create a detailed essay plan with exactly 2 body paragraphs. Build on the learner's position and argument.

Respond with ONLY valid JSON:
{
  "position": "the learner's stance restated as one clear sentence",
  "thesis": "one-sentence thesis for the essay introduction",
  "body": [
    {
      "label": "Body Paragraph 1",
      "argument": "main claim",
      "support": "why this claim is valid",
      "example": "a concrete, specific, memorable example"
    },
    {
      "label": "Body Paragraph 2",
      "argument": "second main claim",
      "support": "why this is valid",
      "example": "a concrete, specific, memorable example"
    }
  ],
  "concession": "one sentence acknowledging the opposing view (include only if it genuinely strengthens the essay)",
  "writing_tips": ["tip 1", "tip 2", "tip 3"]
}

Rules:
- Exactly 2 body paragraphs
- writing_tips must be specific to this essay, not generic advice
- concession is optional — omit the field if it does not add value
- Do not add any text outside the JSON`

export async function POST(request: NextRequest) {
  const { prompt, position, argument } = await request.json()

  try {
    const raw = await generateJSON(PROMPT_TEMPLATE(prompt, position, argument))
    const parsed = EssayPlanSchema.parse(raw)
    return NextResponse.json(parsed)
  } catch {
    return NextResponse.json(MOCK_ESSAY_PLAN)
  }
}
