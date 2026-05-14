# IELTS Gym MVP Features

Last updated: 2026-05-06

## Product Promise

IELTS Gym helps band 5.5-6.5 learners practise Writing Task 2 through a focused training loop: think about the prompt, build an owned plan, write an essay, and receive structured feedback.

## Current MVP Flow

1. Prompt: learner enters or loads an IELTS Writing Task 2 question.
2. Debate: learner writes their own stance and strongest reason, with AI hints hidden behind `Give me a hint`.
3. Plan: AI generates a two-body-paragraph plan that the learner can edit before writing.
4. Write: learner writes with both the original topic and edited plan visible.
5. Feedback: AI returns structured feedback with fallback data if generation fails.

## Implemented Features

- Next.js 16 web app with a single 5-step Writing Task 2 flow.
- Gemini-backed debate opener, debate follow-up, plan generation, and feedback generation.
- Mock fallback data for all AI routes so the demo can continue after AI failure or malformed input.
- Think-first debate UI: hints are optional, not shown by default.
- Editable plan fields: position, thesis, body arguments, support, examples, concession, and writing tips display.
- Writing screen topic reference so the learner can see the original task while writing.
- Structured feedback schema: band estimate, top issues, rewrite sample, and next actions.
- Capacitor static export path for app builds, using `NEXT_PUBLIC_API_URL` to call the deployed web API.

## Known Limitations

- No authentication, user history, payments, dashboard, or persistence beyond the current session.
- No IELTS Writing Task 1, Speaking, Reading, or Listening support.
- No AI-assisted plan revision yet; learners can edit fields manually.
- Feedback quality depends on prompt quality and Gemini response quality; there is no evaluator benchmark yet.
- The Capacitor/static build requires a deployed API base URL because static export cannot serve POST route handlers locally.

## Next Product Questions

- Should the next iteration add back-navigation across all steps, or keep the current linear demo flow?
- Should essays and plans be saved locally as session history before adding accounts?
- Should feedback become more IELTS-rubric-specific with separate Task Response, Coherence, Lexical Resource, and Grammar sections?
- Should visual polish happen before user testing, or should the current MVP be tested with 1-3 representative learners first?
