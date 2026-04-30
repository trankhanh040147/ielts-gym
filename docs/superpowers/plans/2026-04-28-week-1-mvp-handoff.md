# Week 1 MVP Implementation Handoff Plan

> **For Claude Code / coding agents:** Start with the workflow skills required by your own environment. If using Superpowers, begin with `brainstorming` before implementation. This document is product and implementation context, not a replacement for the coding agent's own planning workflow. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished Week 1 demo of IELTS Gym: an IELTS Writing Task 2 flow that helps a band 5.5-6.5 learner debate ideas, create an outline, write an essay, and receive actionable feedback.

**Architecture:** Keep the implementation as a focused web demo and avoid production-platform scope. The coding agent may choose the framework, file structure, API shape, and testing tools, but must preserve the product loop and Week 1 boundaries from the Day 1 spec.

**Tech Stack:** To be selected by the coding agent based on the current repo and fastest stable path. Prefer a simple, maintainable web stack with one primary AI integration path and structured AI outputs.

---

## Source Documents

- Product spec: `docs/superpowers/specs/2026-04-28-day-1-mvp-design.md`
- Day 2 spec: `docs/superpowers/specs/2026-04-29-day-2-idea-to-essay-design.md`
- Roadmap seed: `docs/roadmap.md`

## Product Decisions That Must Not Change

- First user: IELTS learners around band 5.5-6.5.
- First skill: IELTS Writing Task 2 only.
- Core loop: prompt -> AI idea debate -> outline -> essay writing -> feedback.
- Week 1 priority: polished demo-first vertical slice, not a complete platform.
- Excluded in Week 1: Task 1, Speaking, Reading, Listening, auth, payment, subscriptions, long-term dashboard, teacher dashboard, full benchmark infrastructure, and local/open-source model setup.

## Definition Of Polished Demo

The demo is polished when:

- A new user understands the product within the first minute.
- The golden demo path runs reliably end to end.
- The AI debate is short, directed, and produces a usable outline.
- Feedback is structured and actionable, not generic essay correction.
- The UI has credible copy, loading states, empty states, and recoverable error states.

## Suggested File Responsibilities

The coding agent should decide exact paths after inspecting or creating the app structure. Regardless of stack, keep these responsibilities separate:

- Product flow screen: owns the step-by-step user journey.
- Debate prompt logic: turns an IELTS prompt and user answers into a thesis, two main ideas, and examples.
- Feedback prompt logic: turns prompt, outline, and essay into structured feedback.
- Demo sample data: provides at least one reliable golden path.
- AI provider wrapper: isolates model calls and structured output parsing.
- UI state and error handling: keeps user input safe during AI failures.

If the repo has no app scaffold, create the smallest web app scaffold that can support the demo. Do not add infrastructure that is not needed for Week 1.

## Task 1: Inspect And Propose Technical Path

**Files:**

- Read: `README.md`
- Read: `docs/roadmap.md`
- Read: `docs/superpowers/specs/2026-04-28-day-1-mvp-design.md`
- Create or modify only after proposing the technical path.

- [ ] **Step 1: Inspect the repo**

Run:

```bash
ls
git status --short
```

Expected: confirm whether the repo has an app scaffold or is still documentation-only.

- [ ] **Step 2: Read the product spec**

Read `docs/superpowers/specs/2026-04-28-day-1-mvp-design.md` and extract the product constraints before proposing code.

- [ ] **Step 3: Propose a minimal technical path**

Write a short implementation note before coding that answers:

```markdown
## Technical Path

- App stack:
- Why this stack is fastest and stable for Week 1:
- AI integration approach:
- Data persistence decision for Week 1:
- What will not be built this week:
```

Acceptance: the note keeps the product scope unchanged and does not add auth, payment, dashboards, or non-Task-2 skills.

## Task 2: Create The Demo Skeleton

**Files:**

- Create or modify app scaffold files chosen in Task 1.
- Create a product flow page/screen.
- Create demo sample data if useful.

- [ ] **Step 1: Build a visible end-to-end flow with mocked content**

The first working version should show these steps in order:

```text
1. Enter IELTS Task 2 prompt
2. Generate or view idea-to-essay plan
3. Review stance, thesis, main ideas, examples, and paragraph plan
4. Write essay
5. View mocked feedback preview
```

Acceptance: a user can click or move through every step without real AI integration.

- [ ] **Step 2: Add golden demo content**

Include one sample Task 2 prompt and one sample essay path that makes the product value obvious.

Use this sample prompt if no better one is chosen:

```text
Some people believe that university students should study whatever they like. Others believe they should only study subjects that will be useful in the future, such as science and technology. Discuss both views and give your own opinion.
```

Acceptance: the demo can be shown without the user typing everything from scratch.

- [ ] **Step 3: Verify the skeleton manually**

Run the app using the chosen dev command.

Expected: the app loads locally and the full mocked flow is reachable.

## Task 3: Implement Idea-To-Essay Plan

**Files:**

- Create or modify AI prompt logic for idea development and essay planning.
- Create or modify AI provider wrapper.
- Modify product flow screen to use the idea-to-essay plan.

- [ ] **Step 1: Define the idea-to-essay output contract**

The idea-to-essay result must contain these fields, regardless of implementation language:

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

Acceptance: the UI can render the result without parsing free-form prose.

- [ ] **Step 2: Keep planning bounded**

Implement the planning flow so it quickly turns a Task 2 prompt into a usable stance, thesis, main ideas, examples, and paragraph plan.

Acceptance: the user is guided toward writing, not trapped in open-ended chat.

- [ ] **Step 3: Add fallback behavior**

If AI output fails or is malformed, preserve user input and show a retry option or mocked fallback.

Acceptance: the demo does not lose the prompt or user answers when AI fails.

- [ ] **Step 4: Keep feedback mocked for Day 2**

Do not implement real AI essay feedback in Day 2 unless explicitly requested later.

Acceptance: the final step can show mocked feedback preview while making clear that the Day 2 focus is idea-to-essay planning.

## Task 4: Implement Essay Feedback

**Files:**

- Create or modify AI prompt logic for essay feedback.
- Create or modify structured output parsing.
- Modify feedback display in the product flow.

- [ ] **Step 1: Define the feedback output contract**

The feedback result must contain these fields, regardless of implementation language:

```json
{
  "bandEstimate": "string",
  "topIssues": [
    {
      "title": "string",
      "whyItMatters": "string",
      "fix": "string"
    }
  ],
  "rewriteSample": "string",
  "nextActions": ["string"]
}
```

Acceptance: feedback can be displayed as structured sections, not one long chat response.

- [ ] **Step 2: Tune feedback for band 5.5-6.5 learners**

Feedback should be direct, understandable, and focused on the biggest score blockers.

Acceptance: output includes an estimated band range, exactly or approximately 3 top issues, one rewrite sample, and concrete next actions.

- [ ] **Step 3: Add error handling**

If feedback generation fails, keep the essay text intact and show a retry path.

Acceptance: no user writing is lost after an AI failure.

## Task 5: Polish The Demo Path

**Files:**

- Modify product copy, UI states, and sample data in the files created by earlier tasks.

- [ ] **Step 1: Improve first-minute clarity**

Add copy that explains the product in plain language:

```text
Practice IELTS Writing Task 2 with an AI coach that helps you find ideas, build an outline, write your essay, and get focused feedback.
```

Acceptance: the page makes the product promise clear without requiring an explanation from the builder.

- [ ] **Step 2: Add loading, empty, and retry states**

Cover these states:

```text
- No prompt entered yet
- Debate/outline is generating
- Feedback is generating
- AI call failed and user can retry
- Essay is empty when user tries to request feedback
```

Acceptance: the demo feels intentional even when the user has not entered data or AI is slow.

- [ ] **Step 3: Verify the golden path**

Run the app and complete the demo from sample prompt to feedback.

Expected: no crashes, no lost input, and the full loop is visible.

## Task 6: Week 1 Review Artifacts

**Files:**

- Create or modify a short demo notes document if useful.
- Modify `docs/roadmap.md` only if the roadmap needs to reflect decisions already approved in the Day 1 spec.

- [ ] **Step 1: Record what was built**

Add a short note with:

```markdown
## Week 1 Demo Notes

- Golden prompt:
- Golden user path:
- Known limitations:
- Next product question:
```

Acceptance: the next session can continue without rediscovering the demo state.

- [ ] **Step 2: Decide whether to add waitlist or landing-lite**

Only add a waitlist or landing section if the core demo is already stable.

Acceptance: commercial validation does not distract from the Task 2 demo loop.

## Verification Checklist

Before claiming the Week 1 demo is ready, verify:

- [ ] The app runs locally with the chosen dev command.
- [ ] The golden demo path works from prompt to feedback.
- [ ] The idea-to-essay plan produces a stance, thesis, main ideas, examples, and paragraph plan.
- [ ] Feedback includes band estimate, top issues, rewrite sample, and next actions.
- [ ] User essay text is not lost on feedback failure.
- [ ] Week 1 exclusions remain excluded.
- [ ] The final implementation does not contradict `docs/superpowers/specs/2026-04-28-day-1-mvp-design.md`.

## Suggested Commit Rhythm

Commit after each stable task if the user wants commits:

```bash
git add <changed-files>
git commit -m "feat: scaffold writing demo flow"
git commit -m "feat: add idea-to-essay planning flow"
git commit -m "feat: add structured essay feedback"
git commit -m "polish: improve week 1 demo path"
```

Do not commit automatically unless the user explicitly asks for commits.
