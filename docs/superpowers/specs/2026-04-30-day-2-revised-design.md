# Day 2 Revised Design: Idea-to-Essay with AI Debate

Date: 2026-04-30

## Context

Day 1 defined the product as an AI Writing Gym for IELTS Writing Task 2, targeting band 5.5–6.5 learners. The core loop is: debate ideas → outline → write → feedback.

Day 2 builds the first working web app: a 5-step flow where the user debates their position with AI (2 directed rounds), receives a structured essay plan, writes in an editor, and sees a mocked feedback preview.

This spec supersedes the Day 2 design dated 2026-04-29 with two key changes: the debate step is now in scope (not deferred), and the output schema is redesigned from scratch.

## Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **AI:** Google Generative AI SDK with `gemini-3-flash-preview`
- **Validation:** Zod
- **Persistence:** None — all state is client-side for Week 1

## Product Flow (5 Steps)

```
Step 1: Prompt
  User enters or loads an IELTS Task 2 prompt.
  A sample prompt is pre-loaded to enable fast demo.

Step 2: Debate
  AI asks 2 focused questions to help the user commit to a position.
  Round 1: AI asks for the user's stance (with 2–3 pre-filled options).
  Round 2: AI acknowledges the stance and asks for the main argument.
  After round 2, the debate ends and plan generation begins.

Step 3: Plan
  AI generates a structured essay plan from the debate context.
  User reviews the plan before writing.

Step 4: Write
  User writes the essay in a simple textarea editor.
  The essay plan is visible alongside the editor for reference.

Step 5: Feedback (mocked)
  A static mocked feedback card is shown.
  Clearly labelled as preview — real feedback is a Day 4 feature.
```

The debate is short by design. It should never feel like open-ended chat. Two rounds maximum; the goal is to reduce blank-page fear, not to hold a conversation.

## AI Output Schemas

All AI outputs are validated with Zod. On parse failure, fallback mock data is used and the flow continues.

### DebateOpener (Step 1 → Step 2, Round 1)

```typescript
interface DebateOpener {
  topic_summary: string        // one sentence restating the prompt
  question: string             // e.g., "Which side do you lean toward?"
  position_options: string[]   // 2–3 short options for the learner to pick
}
```

### DebateFollowUp (Round 1 → Round 2)

```typescript
interface DebateFollowUp {
  acknowledgment: string       // one sentence affirming the user's choice
  question: string             // probe for their strongest argument
  argument_hints?: string[]    // optional: 2–3 scaffolding hints
}
```

### EssayPlan (Round 2 → Step 3)

```typescript
interface EssayPlan {
  position: string             // user's stance restated as a clear sentence
  thesis: string               // one-sentence thesis for the introduction
  body: Array<{
    label: string              // "Body Paragraph 1", "Body Paragraph 2"
    argument: string           // main claim for the paragraph
    support: string            // why this claim is valid
    example: string            // concrete example to use
  }>
  concession?: string          // one optional counterpoint to acknowledge
  writing_tips: string[]       // 2–3 tips specific to this essay and position
}
```

### MockedFeedback (Step 5, static)

```typescript
interface MockedFeedback {
  band_estimate: string        // e.g., "6.0–6.5"
  top_issues: Array<{
    title: string
    why_it_matters: string
    fix: string
  }>
  rewrite_sample: string
  next_actions: string[]
}
```

The mocked feedback is hardcoded in `lib/mock-data.ts` and never calls the AI in Day 2.

## API Routes

| Route | Input | Output | Notes |
|---|---|---|---|
| `POST /api/debate/open` | `{ prompt }` | `DebateOpener` | Round 1 AI call |
| `POST /api/debate/respond` | `{ prompt, position }` | `DebateFollowUp` | Round 2 AI call — asks for argument, does not receive it yet |
| `POST /api/plan/generate` | `{ prompt, position, argument }` | `EssayPlan` | Final plan call — user's argument collected after Round 2 |

The debate routes and plan route are separate to keep each function small and independently fallback-able. If the Round 2 call fails, the plan generation can still proceed with Round 1 data.

## File Structure

```
app/
  page.tsx                          # 5-step orchestrator (client component)
  api/
    debate/
      open/route.ts                 # DebateOpener
      respond/route.ts              # DebateFollowUp
    plan/
      generate/route.ts             # EssayPlan
components/
  steps/
    PromptStep.tsx
    DebateStep.tsx                  # handles both debate rounds
    PlanStep.tsx
    WritingStep.tsx
    FeedbackStep.tsx                # renders MockedFeedback
lib/
  gemini.ts                         # Gemini client (gemini-3-flash-preview)
  schemas.ts                        # Zod schemas for all AI outputs
  mock-data.ts                      # fallback for each step
.env.local                          # GEMINI_API_KEY (not committed)
```

## State Management

All step state lives in a single `useReducer` in `page.tsx`. No external state library.

```typescript
type Step = 'prompt' | 'debate' | 'plan' | 'writing' | 'feedback'

interface AppState {
  step: Step
  prompt: string
  debateRound: 1 | 2
  debateOpener: DebateOpener | null
  userPosition: string
  userArgument: string
  debateFollowUp: DebateFollowUp | null
  plan: EssayPlan | null
  essay: string
  isLoading: boolean
  error: string | null
}
```

User input is never lost on AI failure. On error, `isLoading` goes false and `error` is set; the user sees a retry button and their previous inputs remain.

## Fallback Behavior

Every AI call wraps in try/catch:
- Parse failure or network error → load mock data for that step → flow continues
- Error message shown inline, non-blocking

Mock data covers: `DebateOpener`, `EssayPlan`, and `MockedFeedback`. `DebateFollowUp` fallback is a simple static response.

## Out of Scope for Day 2

- Real AI essay feedback (Day 4)
- Visual polish pass (Day 5)
- Auth, payment, database, dashboard
- Task 1, Speaking, Reading, Listening
- More than 2 debate rounds

## Success Criteria

Day 2 is complete when:

- The app runs locally with `npm run dev`
- A user can complete the full 5-step flow using a sample prompt
- The debate produces a real plan via Gemini (or gracefully falls back)
- No user input is lost on AI failure
- Mocked feedback is clearly labelled as preview
- Week 1 exclusions remain excluded
