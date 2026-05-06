import { NextRequest, NextResponse } from 'next/server'
import { generateJSON } from '@/lib/gemini'
import { MockedFeedbackSchema } from '@/lib/schemas'
import { MOCK_FEEDBACK } from '@/lib/mock-data'

const PROMPT_TEMPLATE = (task: string, plan: unknown, essay: string) =>
  `You are an IELTS Writing Task 2 examiner and coach for a band 5.5-6.5 learner.

Task prompt: "${task}"
Learner's essay plan: ${JSON.stringify(plan)}
Learner's essay: "${essay}"

Give concise, high-impact feedback that helps the learner improve their next draft.

Respond with ONLY valid JSON:
{
  "band_estimate": "one realistic IELTS band range, such as 6.0-6.5",
  "top_issues": [
    {
      "title": "short issue title",
      "why_it_matters": "why this issue affects IELTS scoring",
      "fix": "one specific action the learner can take"
    }
  ],
  "rewrite_sample": "one improved sentence or short paragraph from the learner's essay",
  "next_actions": ["action 1", "action 2", "action 3"]
}

Rules:
- top_issues: exactly 3 issues, ordered by score impact
- Focus on Task Response, Coherence and Cohesion, Lexical Resource, and Grammar only when relevant
- Use plain English for a band 5.5-6.5 learner
- Avoid vague praise and generic advice
- Do not add any text outside the JSON`

export async function POST(request: NextRequest) {
  try {
    const { prompt, plan, essay } = await request.json()
    const raw = await generateJSON(PROMPT_TEMPLATE(prompt, plan, essay))
    const parsed = MockedFeedbackSchema.parse(raw)
    return NextResponse.json(parsed)
  } catch {
    return NextResponse.json(MOCK_FEEDBACK)
  }
}
