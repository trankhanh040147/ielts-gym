# Day 2 Design: Idea-to-Essay Functional Slice

Date: 2026-04-29

## Context

Day 1 defined IELTS Gym as an AI Writing Gym for IELTS Writing Task 2 learners around band 5.5-6.5. The Week 1 direction is a polished demo-first vertical slice, but Day 2 should not spend time on visual polish before the product loop exists.

Day 2 focuses on creating a functional product flow that proves the main user value: helping a learner move from a Task 2 prompt to a usable essay plan and then into writing.

## Workflow Decision

Use `Polish-later` for UI workflow.

Claude Design should not be used at the start of Day 2. It should be used later, around Day 5 or after real screens exist, to improve visual hierarchy, trust, and demo polish.

Reasoning:

- The product loop is not real yet.
- Design work is more useful after there are actual screens and content to improve.
- Build time is limited, so Day 2 should prioritize functional progress.

## Day 2 Goal

Build an `Idea-to-essay functional slice`.

The user should be able to:

1. Enter or load an IELTS Writing Task 2 prompt.
2. Generate or view a structured idea plan.
3. See stance, thesis, main ideas, supporting points, examples, and paragraph plan.
4. Move into an essay editor using that plan.
5. Reach a feedback step with a mocked feedback preview.

The Day 2 demo should feel like a real product flow even if not every AI step is production-ready.

## AI Scope

The Day 2 AI spike should focus on idea development, not essay feedback.

Preferred real AI behavior:

- Input: IELTS Task 2 prompt.
- Output: structured idea-to-essay plan.
- Include stance, thesis, two main ideas, supporting points, examples, and paragraph plan.

Expected output shape:

```json
{
  "stance": "string",
  "thesis": "string",
  "mainIdeas": [
    {
      "claim": "string",
      "supportingPoint": "string",
      "example": "string",
      "paragraphPurpose": "string"
    }
  ],
  "counterpoint": "string",
  "paragraphPlan": ["string"],
  "writingTips": ["string"]
}
```

If real AI setup is slow or fails, use mocked fallback output so the full flow still works.

## Out Of Scope For Day 2

- Real AI essay feedback.
- Deep IELTS rubric scoring.
- Login, payment, account management, or dashboard.
- Long-term persistence.
- Claude Design visual pass.
- Task 1, Speaking, Reading, or Listening.

## UX Requirements

The Day 2 flow should optimize for clarity and progress, not visual polish.

Minimum UX requirements:

- A clear first screen explaining the product promise.
- A sample prompt that can start the demo quickly.
- Visible steps: prompt, idea plan, essay editor, mocked feedback preview.
- User input should not be lost when moving between steps.
- AI failure should not block the demo; fallback content should keep the flow moving.

## Success Criteria

Day 2 is successful when:

- A clickable flow exists from prompt to mocked feedback preview.
- The idea-to-essay plan is the strongest part of the demo.
- The generated or mocked plan helps the user start writing.
- The essay editor can use the plan as context.
- The demo works without relying on visual polish.
- The scope remains aligned with Day 1: Writing Task 2 for band 5.5-6.5 learners.

## Handoff To Claude Code

Claude Code should still start with its own `brainstorming` workflow before implementation.

This spec defines product scope and acceptance criteria only. Claude Code may choose the app stack, file structure, component design, API shape, and test strategy, as long as it preserves the Day 2 goal and Week 1 constraints.
