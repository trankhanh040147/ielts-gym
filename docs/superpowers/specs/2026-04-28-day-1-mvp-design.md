# Day 1 MVP Design: IELTS Gym

Date: 2026-04-28

## Context

IELTS Gym is a 30-day Vibe Code series to build a real IELTS practice product that can be used and sold to real users. The product should stay focused, practical, and differentiated from broad IELTS apps that have many features but weak learning outcomes.

Available build time is limited: 1 hour per weekday and 3 hours per weekend day. Day 1 should produce a clear MVP plan, Week 1 roadmap, and workflow plan. It should not over-specify implementation details that will be handled by the coding agent later.

## Target User

The first target user is an IELTS learner around band 5.5-6.5 who is stuck on Writing Task 2.

This segment is narrow enough for a sharp MVP and has a clear pain: they can write essays, but often lose marks because of weak ideas, unclear structure, repeated language problems, and generic feedback that does not tell them what to fix next.

## Product Positioning

IELTS Gym starts as an AI Writing Gym for IELTS Task 2.

The core promise is: help learners move from being stuck on ideas to producing an essay with clear, actionable feedback.

The first product loop is:

1. User enters an IELTS Writing Task 2 prompt.
2. AI debates ideas with the user briefly.
3. User gets a usable outline.
4. User writes an essay.
5. AI gives structured, actionable feedback.

The differentiation is not simply "AI essay correction." The product should behave like a focused training loop: help the learner think, write, see the highest-impact weaknesses, and know the next action.

## MVP Scope

The Week 1 MVP should be a polished demo-first vertical slice of the Task 2 flow.

"Polished" means the core demo is understandable, reliable, and visually credible enough for a real learner or series viewer to try. It does not mean building a complete production platform.

Included:

- One end-to-end Task 2 flow: debate ideas, outline, essay writing, feedback.
- Short AI debate that ends with a concrete outline.
- Feedback that is structured and actionable.
- A golden demo path that works reliably for the series.
- A few sample essays or sample prompts to check feedback quality.

Excluded for Week 1:

- Writing Task 1.
- Speaking, Reading, or Listening.
- Login, payment, subscription, and account management.
- Long-term learning history or dashboard.
- Teacher dashboard.
- Full benchmark/evaluation infrastructure.
- Local/open-source model setup unless a later constraint makes it necessary.

## Feedback Requirements

Feedback should be concise, structured, and useful for a learner at band 5.5-6.5.

Minimum feedback fields:

- Estimated band range.
- Top 3 issues hurting the score.
- One improved rewrite sample.
- Next action for the learner.

Feedback should avoid vague praise or generic correction. It should identify what most affects score and guide the learner toward a concrete improvement.

## AI Debate Requirements

The idea debate should not become an open-ended chatbot.

It should be short, directed, and always lead to writing. A good first version asks a few focused questions, helps the learner choose a position, then produces a thesis, two main ideas, and usable examples.

The debate is successful if it reduces blank-page friction without delaying the user from writing.

## Week 1 Roadmap

Day 1: Product/spec planning

- Finalize MVP plan.
- Finalize Week 1 roadmap.
- Finalize workflow and model/tool choices.
- Write a handoff-ready spec for the coding agent.

Day 2: Demo skeleton

- Create the basic web demo flow.
- Prioritize a polished path over complete infrastructure.
- The flow may use mocked AI responses if needed.

Day 3: AI debate and outline

- Add AI support for idea debate and outline generation.
- Keep the debate short and outcome-driven.

Day 4: AI feedback

- Add AI feedback for submitted essays.
- Keep output structured enough for a stable UI.

Day 5: Demo polish

- Improve copy, empty states, loading states, and the golden demo path.
- Prepare the product story for the Vibe Code series.

Weekend: Review and iterate

- Test with 1-3 real or representative users if possible.
- If users are not available, test with at least 3 sample essays.
- Improve prompt quality, UX clarity, and demo reliability.
- Add a lightweight waitlist or landing section only if the core demo is stable.

## Workflow Plan

The workflow should optimize for shipping fast and staying stable.

Recommended default:

- Use a strong reasoning model for product planning, scope debate, prompt design, rubric design, and review.
- Use OpenCode or a Claude-Code-style coding agent for implementation handoff.
- Keep the coding handoff small and plan-driven.
- Use a single primary coding workflow before adding extra tools.

UI/UX tools:

- Start with the primary coding agent for UI implementation.
- Use specialized UI tools only if visual polish becomes a bottleneck.

Open-source/local models:

- Do not use OpenClaw or local/open-source models in Week 1 by default.
- Revisit in Week 2 if cost, privacy, or evaluator independence becomes important.

Model behavior guidance:

- Use lower randomness for scoring and feedback.
- Use moderate creativity for idea debate.
- Prefer structured outputs for feedback so the UI can stay predictable.

## Commercial Hypothesis

The Week 1 product does not need payment, subscriptions, or a full landing page. It should still point toward a sellable offer.

The first paid hypothesis is: IELTS 5.5-6.5 learners will pay for a focused Task 2 training tool if it gives clearer idea support and more actionable feedback than generic AI chat.

Possible early offer after the demo works:

- A low-cost monthly writing practice tool.
- A paid essay feedback pack.
- A waitlist for learners who want structured Task 2 improvement.

The product should not choose the final pricing model in Week 1. It should create enough demo clarity to test interest.

## Handoff Boundary For Coding Agent

This spec intentionally avoids locking implementation details such as framework, file structure, component boundaries, database choice, API shape, and test framework.

The coding agent should use this spec to create a technical implementation plan. That plan may choose the stack and architecture, but it should preserve the product decisions here:

- Focus on IELTS Writing Task 2.
- Serve IELTS 5.5-6.5 learners first.
- Build a polished demo-first vertical slice.
- Keep the flow as debate ideas, outline, write, feedback.
- Avoid non-essential platform features in Week 1.

## Success Criteria

By the end of Week 1, the product should have a polished demo that clearly communicates the value of IELTS Gym.

Success means:

- A user can understand the product within the first minute.
- The golden demo path works reliably.
- The product demonstrates the full loop from idea support to essay feedback.
- Feedback feels more actionable than generic AI correction.
- The scope remains small enough to continue iterating during the 30-day series.
