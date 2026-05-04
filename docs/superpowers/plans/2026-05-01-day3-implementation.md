# IELTS Gym Day 3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the IELTS Gym web app — a 5-step AI-powered flow (Prompt → Debate → Plan → Write → Mocked Feedback) on Next.js 16 with Gemini, deployable to Vercel and packageable as a Capacitor app.

**Architecture:** Single Next.js 16 (App Router) app with client-side `useReducer` state machine, three server-side API routes for Gemini calls, Zod validation with mock data fallback on every AI call. Dual-mode build: standard for Vercel, `output: 'export'` for Capacitor.

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS, shadcn/ui, `@google/generative-ai` (gemini-3-flash-preview), Zod, Capacitor, Jest, React Testing Library

---

## File Map

```
app/
  layout.tsx                        modify — add metadata and font
  page.tsx                          create — 5-step orchestrator with useReducer
  globals.css                       modify — keep Tailwind directives
  api/
    debate/
      open/route.ts                 create — DebateOpener AI call
      respond/route.ts              create — DebateFollowUp AI call
    plan/
      generate/route.ts             create — EssayPlan AI call
components/
  steps/
    PromptStep.tsx                  create
    DebateStep.tsx                  create
    PlanStep.tsx                    create
    WritingStep.tsx                 create
    FeedbackStep.tsx                create
lib/
  gemini.ts                         create — Gemini client wrapper
  schemas.ts                        create — Zod schemas + inferred types
  mock-data.ts                      create — fallback data for every AI output
__tests__/
  lib/schemas.test.ts               create
  lib/gemini.test.ts                create
  api/debate-open.test.ts           create
  api/plan-generate.test.ts         create
jest.config.ts                      create
jest.setup.ts                       create
next.config.ts                      modify — add dual-mode output
capacitor.config.ts                 create
.env.local                          create — GEMINI_API_KEY, NEXT_PUBLIC_API_URL
```

---

## Task 1: Initialize Next.js 16 in the existing repo

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`

- [ ] **Step 1: Scaffold Next.js 16 app in repo root**

Run inside `/home/khanh/src/0_github/ielts-gym`:

```bash
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --yes
```

When prompted about the existing directory, confirm to continue.

Expected: `package.json`, `app/`, `public/`, `tsconfig.json`, `next.config.ts` created. No errors.

- [ ] **Step 2: Install additional dependencies**

```bash
npm install zod @google/generative-ai
npm install -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest
```

Expected: `node_modules` updated, no peer dependency errors.

- [ ] **Step 3: Create `.env.local`**

```bash
cat > .env.local << 'EOF'
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_API_URL=
EOF
```

`NEXT_PUBLIC_API_URL` is empty for local/web — Capacitor builds set it to the Vercel deployment URL.

- [ ] **Step 4: Update `next.config.ts` for dual-mode build**

Replace the full contents of `next.config.ts`:

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: process.env.BUILD_TARGET === 'app' ? 'export' : undefined,
}

export default nextConfig
```

- [ ] **Step 5: Verify dev server starts**

```bash
npm run dev
```

Expected: `ready - started server on 0.0.0.0:3000`. Open `http://localhost:3000` — Next.js default page loads.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js 16 app with TypeScript and Tailwind"
```

---

## Task 2: Configure Jest

**Files:**
- Create: `jest.config.ts`, `jest.setup.ts`

- [ ] **Step 1: Create `jest.config.ts`**

```typescript
import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testPathPattern: '__tests__',
}

export default createJestConfig(config)
```

- [ ] **Step 2: Create `jest.setup.ts`**

```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 3: Add test script to `package.json`**

Open `package.json` and add to `"scripts"`:

```json
"test": "jest",
"test:watch": "jest --watch"
```

- [ ] **Step 4: Verify Jest runs**

```bash
npm test -- --passWithNoTests
```

Expected: `Test Suites: 0 passed` — no errors.

- [ ] **Step 5: Commit**

```bash
git add jest.config.ts jest.setup.ts package.json
git commit -m "chore: configure Jest with React Testing Library"
```

---

## Task 3: Install and configure shadcn/ui

**Files:**
- Create: `components/ui/` (auto-generated by shadcn)

- [ ] **Step 1: Initialize shadcn/ui**

```bash
npx shadcn@latest init --defaults
```

When prompted, accept all defaults (New York style, zinc base color, CSS variables).

Expected: `components/ui/` directory created, `components.json` created.

- [ ] **Step 2: Add required components**

```bash
npx shadcn@latest add button card textarea badge separator
```

Expected: `components/ui/button.tsx`, `card.tsx`, `textarea.tsx`, `badge.tsx`, `separator.tsx` created.

- [ ] **Step 3: Commit**

```bash
git add components/ components.json
git commit -m "chore: add shadcn/ui with button, card, textarea, badge, separator"
```

---

## Task 4: Create Zod schemas

**Files:**
- Create: `lib/schemas.ts`
- Create: `__tests__/lib/schemas.test.ts`

- [ ] **Step 1: Write the failing test**

Create `__tests__/lib/schemas.test.ts`:

```typescript
import {
  DebateOpenerSchema,
  DebateFollowUpSchema,
  EssayPlanSchema,
  MockedFeedbackSchema,
} from '@/lib/schemas'

describe('DebateOpenerSchema', () => {
  it('parses a valid object', () => {
    const input = {
      topic_summary: 'This essay discusses university subject choice.',
      question: 'Which side do you lean toward?',
      position_options: ['Free choice', 'Practical subjects'],
    }
    expect(DebateOpenerSchema.parse(input)).toEqual(input)
  })

  it('throws when position_options is missing', () => {
    expect(() =>
      DebateOpenerSchema.parse({ topic_summary: 'x', question: 'y' })
    ).toThrow()
  })
})

describe('EssayPlanSchema', () => {
  it('parses a valid plan with optional concession', () => {
    const input = {
      position: 'Students should choose freely.',
      thesis: 'Free choice produces motivated learners.',
      body: [
        {
          label: 'Body Paragraph 1',
          argument: 'Motivation increases with interest.',
          support: 'Intrinsic motivation drives deeper learning.',
          example: 'Studies by Deci and Ryan show this effect.',
        },
      ],
      writing_tips: ['Start each paragraph with a clear claim.'],
    }
    expect(EssayPlanSchema.parse(input).concession).toBeUndefined()
  })

  it('parses concession when provided', () => {
    const input = {
      position: 'Students should choose freely.',
      thesis: 'Free choice produces motivated learners.',
      body: [
        {
          label: 'Body Paragraph 1',
          argument: 'Motivation.',
          support: 'Support.',
          example: 'Example.',
        },
      ],
      concession: 'Some argue practical subjects guarantee jobs.',
      writing_tips: ['tip'],
    }
    expect(EssayPlanSchema.parse(input).concession).toBe(
      'Some argue practical subjects guarantee jobs.'
    )
  })
})

describe('MockedFeedbackSchema', () => {
  it('parses valid feedback', () => {
    const input = {
      band_estimate: '6.0–6.5',
      top_issues: [
        { title: 'Weak topic sentences', why_it_matters: 'Costs marks.', fix: 'Rewrite them.' },
      ],
      rewrite_sample: 'In conclusion...',
      next_actions: ['Rewrite topic sentences.'],
    }
    expect(MockedFeedbackSchema.parse(input).band_estimate).toBe('6.0–6.5')
  })
})
```

- [ ] **Step 2: Run test — expect failure**

```bash
npm test -- __tests__/lib/schemas.test.ts
```

Expected: FAIL — `Cannot find module '@/lib/schemas'`

- [ ] **Step 3: Create `lib/schemas.ts`**

```typescript
import { z } from 'zod'

export const DebateOpenerSchema = z.object({
  topic_summary: z.string(),
  question: z.string(),
  position_options: z.array(z.string()),
})

export const DebateFollowUpSchema = z.object({
  acknowledgment: z.string(),
  question: z.string(),
  argument_hints: z.array(z.string()).optional(),
})

export const EssayPlanBodyItemSchema = z.object({
  label: z.string(),
  argument: z.string(),
  support: z.string(),
  example: z.string(),
})

export const EssayPlanSchema = z.object({
  position: z.string(),
  thesis: z.string(),
  body: z.array(EssayPlanBodyItemSchema),
  concession: z.string().optional(),
  writing_tips: z.array(z.string()),
})

export const MockedFeedbackTopIssueSchema = z.object({
  title: z.string(),
  why_it_matters: z.string(),
  fix: z.string(),
})

export const MockedFeedbackSchema = z.object({
  band_estimate: z.string(),
  top_issues: z.array(MockedFeedbackTopIssueSchema),
  rewrite_sample: z.string(),
  next_actions: z.array(z.string()),
})

export type DebateOpener = z.infer<typeof DebateOpenerSchema>
export type DebateFollowUp = z.infer<typeof DebateFollowUpSchema>
export type EssayPlan = z.infer<typeof EssayPlanSchema>
export type MockedFeedback = z.infer<typeof MockedFeedbackSchema>
```

- [ ] **Step 4: Run test — expect pass**

```bash
npm test -- __tests__/lib/schemas.test.ts
```

Expected: PASS, 5 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/schemas.ts __tests__/lib/schemas.test.ts
git commit -m "feat: add Zod schemas for all AI output types"
```

---

## Task 5: Create mock data

**Files:**
- Create: `lib/mock-data.ts`

- [ ] **Step 1: Create `lib/mock-data.ts`**

```typescript
import type { DebateOpener, DebateFollowUp, EssayPlan, MockedFeedback } from './schemas'

export const SAMPLE_PROMPT =
  'Some people believe that university students should study whatever they like. Others believe they should only study subjects that will be useful in the future, such as science and technology. Discuss both views and give your own opinion.'

export const MOCK_DEBATE_OPENER: DebateOpener = {
  topic_summary:
    'This essay asks whether university students should choose subjects freely or focus on practical, career-relevant fields.',
  question: 'Which side do you lean toward?',
  position_options: [
    'Students should study what genuinely interests them',
    'Students should focus on practical, job-ready subjects',
    'A balance of both approaches is best',
  ],
}

export const MOCK_DEBATE_FOLLOW_UP: DebateFollowUp = {
  acknowledgment:
    'Good choice — personal interest drives deeper learning and long-term success.',
  question: 'What is your strongest reason for this view?',
  argument_hints: [
    'Motivation — students learn better when they care about the subject',
    'Innovation — breadth of study leads to creative breakthroughs',
    'Adaptability — a flexible education prepares students for an uncertain job market',
  ],
}

export const MOCK_ESSAY_PLAN: EssayPlan = {
  position:
    'University students should be free to choose subjects that genuinely interest them.',
  thesis:
    'Although practical subjects offer clear career pathways, allowing students to pursue their passions ultimately produces more motivated learners and more innovative graduates.',
  body: [
    {
      label: 'Body Paragraph 1',
      argument: 'Student motivation is higher when studying a subject they care about.',
      support:
        'Intrinsic motivation leads to deeper engagement, better retention, and higher academic performance.',
      example:
        'Research by Deci and Ryan shows that self-determined learners outperform those driven purely by external rewards.',
    },
    {
      label: 'Body Paragraph 2',
      argument: 'Diverse university study fosters the innovation that economies need.',
      support:
        'Many breakthroughs occur at the intersection of disciplines, which only happens when students explore freely.',
      example:
        "Steve Jobs credited his calligraphy class at Reed College with inspiring the typography of the first Macintosh.",
    },
  ],
  concession:
    'Opponents argue that studying only practical subjects guarantees employment, but a degree alone does not ensure a job in a rapidly changing economy.',
  writing_tips: [
    'Use a clear concession in your introduction to show you understand both views before giving your opinion.',
    'End each body paragraph with a sentence that links back to your thesis.',
    'Keep your conclusion short — restate your position and two main reasons in two sentences.',
  ],
}

export const MOCK_FEEDBACK: MockedFeedback = {
  band_estimate: '6.0–6.5',
  top_issues: [
    {
      title: 'Weak topic sentences',
      why_it_matters:
        'IELTS examiners score Coherence & Cohesion heavily. A vague topic sentence loses marks even if the paragraph content is good.',
      fix: 'Start each body paragraph with a single, direct claim — not background or context.',
    },
    {
      title: 'Limited vocabulary range',
      why_it_matters:
        'Lexical Resource is 25% of your score. Repeating the same words signals a limited range.',
      fix: 'Identify 2-3 key terms in the prompt and replace each with at least one synonym or paraphrase across your essay.',
    },
    {
      title: 'Conclusion restates instead of summarising',
      why_it_matters:
        'A weak conclusion that only repeats the introduction loses marks under Task Achievement.',
      fix: 'Briefly summarise your two reasons, then restate your position in fresh language — do not copy from the introduction.',
    },
  ],
  rewrite_sample:
    'In conclusion, while practical subjects offer a clear route to employment, universities serve society better by allowing students to explore their interests. Motivated, curious graduates — regardless of their discipline — are ultimately better equipped to navigate an unpredictable job market.',
  next_actions: [
    'Rewrite your topic sentences so each states one clear argument.',
    'Circle every repeated word in your essay and replace half of them with a synonym.',
    'Read your conclusion aloud — if it sounds like your introduction, rewrite it.',
  ],
}
```

- [ ] **Step 2: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add lib/mock-data.ts
git commit -m "feat: add mock fallback data for all AI output types"
```

---

## Task 6: Create Gemini client

**Files:**
- Create: `lib/gemini.ts`
- Create: `__tests__/lib/gemini.test.ts`

- [ ] **Step 1: Write the failing test**

Create `__tests__/lib/gemini.test.ts`:

```typescript
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
```

- [ ] **Step 2: Run test — expect failure**

```bash
npm test -- __tests__/lib/gemini.test.ts
```

Expected: FAIL — `Cannot find module '@/lib/gemini'`

- [ ] **Step 3: Create `lib/gemini.ts`**

```typescript
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
```

- [ ] **Step 4: Run test — expect pass**

```bash
npm test -- __tests__/lib/gemini.test.ts
```

Expected: PASS, 1 test passes.

- [ ] **Step 5: Commit**

```bash
git add lib/gemini.ts __tests__/lib/gemini.test.ts
git commit -m "feat: add Gemini client wrapper for gemini-3-flash-preview"
```

---

## Task 7: API route — debate/open

**Files:**
- Create: `app/api/debate/open/route.ts`
- Create: `__tests__/api/debate-open.test.ts`

- [ ] **Step 1: Write the failing test**

Create `__tests__/api/debate-open.test.ts`:

```typescript
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
```

- [ ] **Step 2: Run test — expect failure**

```bash
npm test -- __tests__/api/debate-open.test.ts
```

Expected: FAIL — `Cannot find module '@/app/api/debate/open/route'`

- [ ] **Step 3: Create `app/api/debate/open/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { generateJSON } from '@/lib/gemini'
import { DebateOpenerSchema } from '@/lib/schemas'
import { MOCK_DEBATE_OPENER } from '@/lib/mock-data'

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
  const { prompt } = await request.json()

  try {
    const raw = await generateJSON(PROMPT_TEMPLATE(prompt))
    const parsed = DebateOpenerSchema.parse(raw)
    return NextResponse.json(parsed)
  } catch {
    return NextResponse.json(MOCK_DEBATE_OPENER)
  }
}
```

- [ ] **Step 4: Run test — expect pass**

```bash
npm test -- __tests__/api/debate-open.test.ts
```

Expected: PASS, 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add app/api/debate/open/route.ts __tests__/api/debate-open.test.ts
git commit -m "feat: add debate/open API route with Gemini and mock fallback"
```

---

## Task 8: API routes — debate/respond and plan/generate

**Files:**
- Create: `app/api/debate/respond/route.ts`
- Create: `app/api/plan/generate/route.ts`
- Create: `__tests__/api/plan-generate.test.ts`

- [ ] **Step 1: Create `app/api/debate/respond/route.ts`**

```typescript
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
```

- [ ] **Step 2: Write the failing test for plan/generate**

Create `__tests__/api/plan-generate.test.ts`:

```typescript
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
```

- [ ] **Step 3: Run test — expect failure**

```bash
npm test -- __tests__/api/plan-generate.test.ts
```

Expected: FAIL — `Cannot find module '@/app/api/plan/generate/route'`

- [ ] **Step 4: Create `app/api/plan/generate/route.ts`**

```typescript
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
```

- [ ] **Step 5: Run all tests**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 6: Commit**

```bash
git add app/api/debate/respond/route.ts app/api/plan/generate/route.ts __tests__/api/plan-generate.test.ts
git commit -m "feat: add debate/respond and plan/generate API routes"
```

---

## Task 9: Build step components

**Files:**
- Create: `components/steps/PromptStep.tsx`
- Create: `components/steps/DebateStep.tsx`
- Create: `components/steps/PlanStep.tsx`
- Create: `components/steps/WritingStep.tsx`
- Create: `components/steps/FeedbackStep.tsx`

- [ ] **Step 1: Create `components/steps/PromptStep.tsx`**

```typescript
'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { SAMPLE_PROMPT } from '@/lib/mock-data'

interface Props {
  prompt: string
  isLoading: boolean
  error: string | null
  onPromptChange: (v: string) => void
  onSubmit: () => void
}

export default function PromptStep({ prompt, isLoading, error, onPromptChange, onSubmit }: Props) {
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">IELTS Writing Task 2 Practice</h1>
        <p className="text-muted-foreground mt-1">
          Enter a Task 2 question and get AI help to build your ideas, outline, and essay.
        </p>
      </div>

      <Textarea
        placeholder="Enter an IELTS Writing Task 2 question here…"
        className="min-h-32 resize-none"
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        disabled={isLoading}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => onPromptChange(SAMPLE_PROMPT)}
          disabled={isLoading}
        >
          Load sample prompt
        </Button>
        <Button onClick={onSubmit} disabled={!prompt.trim() || isLoading}>
          {isLoading ? 'Generating…' : 'Start debate →'}
        </Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `components/steps/DebateStep.tsx`**

```typescript
'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { DebateOpener, DebateFollowUp } from '@/lib/schemas'

interface Props {
  debateOpener: DebateOpener
  debateFollowUp: DebateFollowUp | null
  debateRound: 1 | 2
  userPosition: string
  userArgument: string
  isLoading: boolean
  error: string | null
  onSelectPosition: (p: string) => void
  onConfirmPosition: () => void
  onArgumentChange: (a: string) => void
  onGeneratePlan: () => void
}

export default function DebateStep({
  debateOpener,
  debateFollowUp,
  debateRound,
  userPosition,
  userArgument,
  isLoading,
  error,
  onSelectPosition,
  onConfirmPosition,
  onArgumentChange,
  onGeneratePlan,
}: Props) {
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-xl font-semibold">Let's find your angle</h2>
        <p className="text-muted-foreground mt-1 text-sm">{debateOpener.topic_summary}</p>
      </div>

      <div className="flex flex-col gap-3">
        <p className="font-medium">{debateOpener.question}</p>
        <div className="flex flex-col gap-2">
          {debateOpener.position_options.map((option) => (
            <button
              key={option}
              onClick={() => onSelectPosition(option)}
              disabled={isLoading}
              className={`text-left px-4 py-3 rounded-lg border transition-colors ${
                userPosition === option
                  ? 'border-primary bg-primary/5 font-medium'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {debateRound === 1 && (
        <Button
          onClick={onConfirmPosition}
          disabled={!userPosition || isLoading}
        >
          {isLoading ? 'Loading…' : 'Continue →'}
        </Button>
      )}

      {debateRound === 2 && debateFollowUp && (
        <div className="flex flex-col gap-4 border-t pt-4">
          <p className="text-sm text-muted-foreground italic">{debateFollowUp.acknowledgment}</p>
          <p className="font-medium">{debateFollowUp.question}</p>

          {debateFollowUp.argument_hints && debateFollowUp.argument_hints.length > 0 && (
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Ideas to consider</p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {debateFollowUp.argument_hints.map((hint) => (
                  <li key={hint}>{hint}</li>
                ))}
              </ul>
            </div>
          )}

          <Textarea
            placeholder="Type your main argument here…"
            className="min-h-24 resize-none"
            value={userArgument}
            onChange={(e) => onArgumentChange(e.target.value)}
            disabled={isLoading}
          />

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            onClick={onGeneratePlan}
            disabled={!userArgument.trim() || isLoading}
          >
            {isLoading ? 'Building plan…' : 'Generate my essay plan →'}
          </Button>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Create `components/steps/PlanStep.tsx`**

```typescript
'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { EssayPlan } from '@/lib/schemas'

interface Props {
  plan: EssayPlan
  onStartWriting: () => void
}

export default function PlanStep({ plan, onStartWriting }: Props) {
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-xl font-semibold">Your Essay Plan</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Use this as your guide while you write.
        </p>
      </div>

      <Card>
        <CardContent className="pt-4 flex flex-col gap-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Your position</p>
          <p className="font-medium">{plan.position}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mt-2">Thesis</p>
          <p className="text-sm italic text-muted-foreground">"{plan.thesis}"</p>
        </CardContent>
      </Card>

      {plan.body.map((para) => (
        <Card key={para.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">{para.label}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <div>
              <span className="font-medium">Argument: </span>{para.argument}
            </div>
            <div>
              <span className="font-medium">Support: </span>{para.support}
            </div>
            <div>
              <span className="font-medium">Example: </span>{para.example}
            </div>
          </CardContent>
        </Card>
      ))}

      {plan.concession && (
        <Card>
          <CardContent className="pt-4 text-sm">
            <span className="font-medium">Concession: </span>{plan.concession}
          </CardContent>
        </Card>
      )}

      {plan.writing_tips.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Writing tips</p>
          <ul className="list-disc list-inside text-sm space-y-1">
            {plan.writing_tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      <Button onClick={onStartWriting} className="self-start">
        Start writing →
      </Button>
    </div>
  )
}
```

- [ ] **Step 4: Create `components/steps/WritingStep.tsx`**

```typescript
'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import type { EssayPlan } from '@/lib/schemas'

interface Props {
  plan: EssayPlan
  essay: string
  onEssayChange: (v: string) => void
  onGetFeedback: () => void
}

export default function WritingStep({ plan, essay, onEssayChange, onGetFeedback }: Props) {
  const wordCount = essay.trim() ? essay.trim().split(/\s+/).length : 0

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-semibold">Write your essay</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Your plan is on the left. Aim for 250–300 words.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-3 text-sm">
          <p className="font-medium">Plan reference</p>
          <div className="rounded-lg border p-4 flex flex-col gap-3 text-muted-foreground">
            <div>
              <span className="font-medium text-foreground">Thesis: </span>
              {plan.thesis}
            </div>
            <Separator />
            {plan.body.map((para) => (
              <div key={para.label}>
                <p className="font-medium text-foreground">{para.label}</p>
                <p>{para.argument}</p>
                <p className="text-xs mt-1">eg. {para.example}</p>
              </div>
            ))}
            {plan.concession && (
              <>
                <Separator />
                <p><span className="font-medium text-foreground">Concession: </span>{plan.concession}</p>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="font-medium text-sm">Your essay</p>
            <span className="text-xs text-muted-foreground">{wordCount} words</span>
          </div>
          <Textarea
            placeholder="Start writing your essay here…"
            className="min-h-64 resize-none"
            value={essay}
            onChange={(e) => onEssayChange(e.target.value)}
          />
          <Button
            onClick={onGetFeedback}
            disabled={wordCount < 50}
          >
            Get feedback preview →
          </Button>
          {wordCount < 50 && wordCount > 0 && (
            <p className="text-xs text-muted-foreground">Write at least 50 words to continue.</p>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Create `components/steps/FeedbackStep.tsx`**

```typescript
'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MOCK_FEEDBACK } from '@/lib/mock-data'

interface Props {
  onStartOver: () => void
}

export default function FeedbackStep({ onStartOver }: Props) {
  const feedback = MOCK_FEEDBACK

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">Feedback Preview</h2>
          <Badge variant="secondary">Demo — real AI feedback coming soon</Badge>
        </div>
        <p className="text-muted-foreground mt-1 text-sm">
          This is a preview of what structured feedback will look like.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <p className="text-sm font-medium">Estimated band</p>
        <Badge className="text-base px-3 py-1">{feedback.band_estimate}</Badge>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">Top issues</p>
        {feedback.top_issues.map((issue) => (
          <Card key={issue.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{issue.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm">
              <p className="text-muted-foreground">{issue.why_it_matters}</p>
              <p><span className="font-medium">Fix: </span>{issue.fix}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Rewrite sample</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm italic text-muted-foreground">"{feedback.rewrite_sample}"</p>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Next actions</p>
        <ul className="list-disc list-inside text-sm space-y-1">
          {feedback.next_actions.map((action, i) => (
            <li key={i}>{action}</li>
          ))}
        </ul>
      </div>

      <Button variant="outline" onClick={onStartOver} className="self-start">
        ← Start over
      </Button>
    </div>
  )
}
```

- [ ] **Step 6: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 7: Commit**

```bash
git add components/steps/
git commit -m "feat: add all 5 step components (Prompt, Debate, Plan, Writing, Feedback)"
```

---

## Task 10: Build the app orchestrator

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace `app/layout.tsx`**

```typescript
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'IELTS Gym — Writing Task 2 Practice',
  description: 'AI-powered IELTS Writing Task 2 coaching for band 5.5–6.5 learners.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.className} min-h-screen bg-background antialiased`}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Replace `app/page.tsx`**

```typescript
'use client'

import { useReducer, useCallback } from 'react'
import type { DebateOpener, DebateFollowUp, EssayPlan } from '@/lib/schemas'
import PromptStep from '@/components/steps/PromptStep'
import DebateStep from '@/components/steps/DebateStep'
import PlanStep from '@/components/steps/PlanStep'
import WritingStep from '@/components/steps/WritingStep'
import FeedbackStep from '@/components/steps/FeedbackStep'

type AppStep = 'prompt' | 'debate' | 'plan' | 'writing' | 'feedback'

interface AppState {
  step: AppStep
  prompt: string
  debateRound: 1 | 2
  debateOpener: DebateOpener | null
  userPosition: string
  debateFollowUp: DebateFollowUp | null
  userArgument: string
  plan: EssayPlan | null
  essay: string
  isLoading: boolean
  error: string | null
}

type AppAction =
  | { type: 'SET_PROMPT'; prompt: string }
  | { type: 'START_LOADING' }
  | { type: 'DEBATE_OPENED'; opener: DebateOpener }
  | { type: 'SET_POSITION'; position: string }
  | { type: 'DEBATE_FOLLOWED_UP'; followUp: DebateFollowUp }
  | { type: 'SET_ARGUMENT'; argument: string }
  | { type: 'PLAN_GENERATED'; plan: EssayPlan }
  | { type: 'SET_ESSAY'; essay: string }
  | { type: 'GO_TO_WRITING' }
  | { type: 'GO_TO_FEEDBACK' }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'RESET' }

const initialState: AppState = {
  step: 'prompt',
  prompt: '',
  debateRound: 1,
  debateOpener: null,
  userPosition: '',
  debateFollowUp: null,
  userArgument: '',
  plan: null,
  essay: '',
  isLoading: false,
  error: null,
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PROMPT':
      return { ...state, prompt: action.prompt }
    case 'START_LOADING':
      return { ...state, isLoading: true, error: null }
    case 'DEBATE_OPENED':
      return { ...state, isLoading: false, step: 'debate', debateRound: 1, debateOpener: action.opener }
    case 'SET_POSITION':
      return { ...state, userPosition: action.position }
    case 'DEBATE_FOLLOWED_UP':
      return { ...state, isLoading: false, debateRound: 2, debateFollowUp: action.followUp }
    case 'SET_ARGUMENT':
      return { ...state, userArgument: action.argument }
    case 'PLAN_GENERATED':
      return { ...state, isLoading: false, step: 'plan', plan: action.plan }
    case 'SET_ESSAY':
      return { ...state, essay: action.essay }
    case 'GO_TO_WRITING':
      return { ...state, step: 'writing' }
    case 'GO_TO_FEEDBACK':
      return { ...state, step: 'feedback' }
    case 'SET_ERROR':
      return { ...state, isLoading: false, error: action.error }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? ''

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const openDebate = useCallback(async () => {
    dispatch({ type: 'START_LOADING' })
    try {
      const res = await fetch(`${API_BASE}/api/debate/open`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: state.prompt }),
      })
      const opener: DebateOpener = await res.json()
      dispatch({ type: 'DEBATE_OPENED', opener })
    } catch {
      dispatch({ type: 'SET_ERROR', error: 'Could not start debate. Please try again.' })
    }
  }, [state.prompt])

  const confirmPosition = useCallback(async () => {
    dispatch({ type: 'START_LOADING' })
    try {
      const res = await fetch(`${API_BASE}/api/debate/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: state.prompt, position: state.userPosition }),
      })
      const followUp: DebateFollowUp = await res.json()
      dispatch({ type: 'DEBATE_FOLLOWED_UP', followUp })
    } catch {
      dispatch({ type: 'SET_ERROR', error: 'Could not continue debate. Please try again.' })
    }
  }, [state.prompt, state.userPosition])

  const generatePlan = useCallback(async () => {
    dispatch({ type: 'START_LOADING' })
    try {
      const res = await fetch(`${API_BASE}/api/plan/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: state.prompt,
          position: state.userPosition,
          argument: state.userArgument,
        }),
      })
      const plan: EssayPlan = await res.json()
      dispatch({ type: 'PLAN_GENERATED', plan })
    } catch {
      dispatch({ type: 'SET_ERROR', error: 'Could not generate plan. Please try again.' })
    }
  }, [state.prompt, state.userPosition, state.userArgument])

  const STEP_LABELS: Record<AppStep, string> = {
    prompt: 'Prompt',
    debate: 'Debate',
    plan: 'Plan',
    writing: 'Write',
    feedback: 'Feedback',
  }
  const STEPS: AppStep[] = ['prompt', 'debate', 'plan', 'writing', 'feedback']
  const currentIndex = STEPS.indexOf(state.step)

  return (
    <main className="min-h-screen p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <nav className="flex gap-2 mb-10 text-sm">
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={`${
                i === currentIndex
                  ? 'text-foreground font-medium'
                  : i < currentIndex
                  ? 'text-muted-foreground'
                  : 'text-muted-foreground/40'
              }`}
            >
              {STEP_LABELS[s]}{i < STEPS.length - 1 && <span className="ml-2 mr-2">→</span>}
            </span>
          ))}
        </nav>

        {state.step === 'prompt' && (
          <PromptStep
            prompt={state.prompt}
            isLoading={state.isLoading}
            error={state.error}
            onPromptChange={(p) => dispatch({ type: 'SET_PROMPT', prompt: p })}
            onSubmit={openDebate}
          />
        )}

        {state.step === 'debate' && state.debateOpener && (
          <DebateStep
            debateOpener={state.debateOpener}
            debateFollowUp={state.debateFollowUp}
            debateRound={state.debateRound}
            userPosition={state.userPosition}
            userArgument={state.userArgument}
            isLoading={state.isLoading}
            error={state.error}
            onSelectPosition={(p) => dispatch({ type: 'SET_POSITION', position: p })}
            onConfirmPosition={confirmPosition}
            onArgumentChange={(a) => dispatch({ type: 'SET_ARGUMENT', argument: a })}
            onGeneratePlan={generatePlan}
          />
        )}

        {state.step === 'plan' && state.plan && (
          <PlanStep
            plan={state.plan}
            onStartWriting={() => dispatch({ type: 'GO_TO_WRITING' })}
          />
        )}

        {state.step === 'writing' && state.plan && (
          <WritingStep
            plan={state.plan}
            essay={state.essay}
            onEssayChange={(e) => dispatch({ type: 'SET_ESSAY', essay: e })}
            onGetFeedback={() => dispatch({ type: 'GO_TO_FEEDBACK' })}
          />
        )}

        {state.step === 'feedback' && (
          <FeedbackStep
            onStartOver={() => dispatch({ type: 'RESET' })}
          />
        )}
      </div>
    </main>
  )
}
```

- [ ] **Step 3: Run dev server and verify full flow manually**

```bash
npm run dev
```

Open `http://localhost:3000`. Walk through:
1. Load sample prompt → click "Start debate"
2. Select a position → click "Continue"
3. Type an argument → click "Generate my essay plan"
4. Review plan → click "Start writing"
5. Type at least 50 words → click "Get feedback preview"
6. View mocked feedback → click "Start over"

Expected: All 5 steps complete without errors. State is preserved through each step. Loading states appear during AI calls.

- [ ] **Step 4: Run full test suite**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx app/layout.tsx
git commit -m "feat: add 5-step app orchestrator with useReducer state machine"
```

---

## Task 11: Configure Capacitor dual-mode build

**Files:**
- Create: `capacitor.config.ts`
- Modify: `package.json` (add build:app script)

- [ ] **Step 1: Install Capacitor**

```bash
npm install @capacitor/core
npm install -D @capacitor/cli @capacitor/ios @capacitor/android
```

Expected: Installed without errors.

- [ ] **Step 2: Create `capacitor.config.ts`**

```typescript
import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.ieltsgym.app',
  appName: 'IELTS Gym',
  webDir: 'out',
}

export default config
```

`webDir: 'out'` is where `next build` with `output: 'export'` writes the static files.

- [ ] **Step 3: Add build scripts to `package.json`**

In `package.json` `"scripts"`, add:

```json
"build:app": "BUILD_TARGET=app next build",
"cap:sync": "npx cap sync",
"cap:ios": "npx cap open ios",
"cap:android": "npx cap open android"
```

- [ ] **Step 4: Verify static export builds**

```bash
npm run build:app
```

Expected: `out/` directory created with static HTML/JS files. No errors. (API routes will not be in `out/` — they are served from Vercel.)

- [ ] **Step 5: Commit**

```bash
git add capacitor.config.ts package.json
git commit -m "feat: configure Capacitor dual-mode build for Web + App"
```

---

## Verification Checklist

Before claiming implementation complete:

- [ ] `npm run dev` — app starts and all 5 steps are reachable
- [ ] Loading sample prompt pre-fills the textarea
- [ ] Debate round 1 shows position options as clickable buttons
- [ ] Selecting a position and clicking Continue triggers debate/respond
- [ ] Debate round 2 shows follow-up question and optional hints
- [ ] Submitting an argument triggers plan/generate
- [ ] Plan shows position, thesis, body paragraphs, and writing tips
- [ ] Writing step shows plan reference alongside the textarea
- [ ] Word count updates as the user types
- [ ] Feedback step shows mocked feedback with "Demo" badge
- [ ] Start Over resets all state
- [ ] `npm test` — all tests pass
- [ ] `npx tsc --noEmit` — no TypeScript errors
- [ ] `npm run build:app` — static export builds without error
- [ ] `.env.local` is in `.gitignore` and not committed
