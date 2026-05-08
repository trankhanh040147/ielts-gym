## Schedule

- Time can spend: 1h/weekday, 3h/weekend

## Mental notes

- Claude is easy to reach limit, consider to find a way to continue without it. Or break smaller tasks before hand Claude

## Goal, Vision

- Series 30 ngày xây dựng một sản phẩm tập luyện thi IELTS. Sản phẩm phải dùng được và bán được cho người dùng thực
- Yếu tố đột phá (SOTA): Những sản phẩm đại trà ko đáp ứng được nhu cầu thực tế vì quá nhiều  tính năng nhưng ko đủ hiệu quả cho việc luyện IELTS. Sản phẩm này sẽ tạo ra sự khác biệt đó để đảm bảo mang lại kết quả tốt nhất cho người dùng
- Vibe Code theo cách hiệu quả, tối giản: Vấn nạn thường gặp khi Vibe Code là có quá nhiều cách làm và ko biết nên chọn cách nào hiệu quả. Series này sẽ chỉ ra những công cụ cần thiết nhất cho quá trình Vibe Code nhanh và đi được đường dài.
- Tập trung tính năng: Những tính năng đầu tiên mà sản phẩm có nên là tính năng hỗ trợ viết (Writing) vì đây là kĩ năng quan trọng và cũng là kỹ năng yếu của những người học Tiếng Anh. Giúp luyện kỹ năng này sẽ nâng cao band điểm hiệu quả nhất. Những kỹ năng như Reading và Listening không cần ưu tiên trước vì đã có quá nhiều sản phẩm hỗ trợ những kỹ năng này. Writing + Vocabulary -> Speaking -> Reading -> Listening là những mức độ ưu tiên của dự án này

## Day1: 28/04/2026 - Done

- Chốt MVP plan: IELTS Writing Task 2 cho learner band 5.5-6.5.
- Chốt core loop: AI debate ideas -> outline -> write essay -> structured feedback.
- Chốt Week 1 roadmap theo hướng polished demo-first vertical slice.
- Chốt workflow plan: tối giản, ship nhanh, dùng coding agent chính; chưa dùng OpenClaw/local models trong Week 1.
- Spec: `docs/superpowers/specs/2026-04-28-day-1-mvp-design.md`
- Claude Code handoff: `docs/superpowers/plans/2026-04-28-week-1-mvp-handoff.md`

## Day2: 30/04/2026 - Done

- Revised spec: AI debate step đưa vào scope Day 2 (không defer sang Day 3).
- Flow 5 bước: Prompt → Debate (2 rounds) → Plan → Write → Mocked Feedback.
- Schema redesign: DebateOpener, DebateFollowUp, EssayPlan — không dùng schema cũ.
- Platform decision: Web + App via Capacitor (Option A — Next.js dual-mode). App dùng static export, API calls trỏ về Vercel. Migrate sang monorepo backend sau Week 1.
- Model: `gemini-3-flash-preview`. Framework: Next.js 16.
- Spec (revised): `docs/superpowers/specs/2026-04-30-day-2-revised-design.md`
- Spec (platform): `docs/superpowers/specs/2026-05-01-platform-strategy-design.md`

## Day3: 01/05/2026

- Bắt đầu implement: scaffold Next.js 16 app, 5-step flow, Gemini integration, Capacitor setup.
- Spec đã approved, chuyển sang writing-plans → implementation.

## Day4: 04/05/2026 - Done

- [x] Continue Day 3 implementation (session got cut off due to Claude daily limit)
- [x] Test and merge Day 3 PR

## Day5: 05/05/2026 - Done

### Product issues fixed

**Issue 1: Debate và Plan đang là "holy receipts" — user follow, không think**

- Vấn đề hiện tại: AI hiện ra position options và full structured plan ngay từ đầu. User chỉ việc chọn và tiếp tục — không cần tư duy gì. Điều này phá vỡ mục đích của debate step; nó là menu, không phải learning exercise.
- Hướng giải quyết: Chuyển sang mô hình "hints on demand". Default state là blank input — user phải tự thử viết position/argument trước. AI hints (pre-filled options, argument scaffolding) ẩn sau nút "Give me a hint", chỉ reveal khi user bấm vào khi bị stuck.
- Key principle: hints phải là lifeline, không phải default. AI nên react với những gì user viết ra, không phải hand them the answer trước khi họ thử.

**Issue 2: Plan là one-way — không revise được, không có ownership**

- Vấn đề hiện tại: Sau debate, plan được generate và present như final. User không thể push back, edit từng section, hay nói với AI "tôi muốn đổi argument cho Body Paragraph 2." Plan bị áp đặt thay vì co-authored.
- Hướng giải quyết: Làm Plan step editable và revisable. Hai sub-problems:
  - (a) Free-text edit: cho user trực tiếp edit các field trong plan (position, thesis, body arguments) trước khi write.
  - (b) AI-assisted revision: cho user type revision request ("make my argument stronger", "add a counterpoint") và AI regenerate chỉ section đó.
  - (a) đơn giản hơn và higher-value — ưu tiên làm trước, (b) có thể làm sau.

### Day 5 approved plan: Think-first + editable plan

Goal: sửa learning loop để user phải tự nghĩ trước, AI chỉ hỗ trợ khi user stuck, và plan trở thành draft user sở hữu thay vì generated receipt.

Primary product behavior:

- Chuyển Debate từ `AI suggests -> user selects -> AI plans` sang `user attempts -> AI hints on demand -> user edits -> user writes`.
- Hints là lifeline, không phải default answer.
- Plan là editable draft/co-authored plan, không phải final truth.

#### Scope for Claude handoff

In scope:

- Hide `position_options` from default Debate UI.
- Add `Give me a hint` reveal for stance options.
- Hide `argument_hints` from default Debate UI.
- Add `Give me a hint` reveal for argument scaffolding.
- Let user type stance and argument in their own words.
- If user selects a hint, fill or append it into the input, but keep it editable.
- Convert Plan step from read-only cards/text into editable fields.
- Editable plan fields should include position, thesis, body paragraph arguments, support, examples, concession, and writing tips.
- Preserve edited plan into Writing step.
- Allow user to go back from Write to Plan without losing edits.
- Keep existing Gemini routes and schemas unless a small type/state tweak is required.
- Keep existing fallback behavior: AI failure should not block user progress.

Out of scope for Day 5:

- AI-assisted plan revision.
- More debate rounds.
- AI grading/evaluating whether the user's attempt is good.
- Real feedback mode changes.
- Full visual redesign/polish beyond what supports the new behavior.
- Issue 3 / PR review items.

#### UX acceptance criteria

Debate:

- On entering Debate, user sees the question plus empty input, not prefilled answers.
- `Give me a hint` reveals existing AI options or hints without overwriting user input.
- User can continue with their own typed stance/argument.
- Hints are optional and remain editable after selection.
- If AI/fallback data fails, user can still type and progress.

Plan:

- Every meaningful plan field is editable before Write.
- Edited plan values are what appear beside the essay editor.
- User can go back from Write to Plan and edits are still there.
- UI communicates that the plan is a draft/co-authored plan, not a final answer.

Success criteria:

- A learner performs at least one cognitive action before seeing AI scaffolding by default.
- The full 5-step flow still works.
- The product no longer feels like AI hands the user a holy receipt.
- The user owns the plan before writing.

#### Suggested implementation order for Claude

1. Inspect current DebateStep, PlanStep, WritingStep, app state shape, and tests.
2. Update Debate UI/state so stance and argument inputs are blank by default.
3. Add local hint reveal state for stance options and argument hints.
4. Ensure hint selection fills/appends into editable inputs without locking them.
5. Add or update tests for hidden hints and user-entered stance/argument.
6. Update PlanStep to render editable fields for all meaningful plan sections.
7. Update reducer/state flow so edited plan persists into WritingStep and back navigation.
8. Add or update tests for plan editing and persistence.
9. Run verification commands: typecheck, tests, lint/build if available, and manual 5-step flow.

Prompt to hand to Claude:

```text
Today is Day 5 for IELTS Gym. Read `docs/roadmap.md` first, especially the Day 5 section.

Use your own judgment and verify the current code before editing. Focus only on Issue 1 and Issue 2: Debate/Plan currently feel like AI-generated "holy receipts" and the user does not think or own the plan.

Implement the approved Day 5 direction: Think-first + editable plan.

Work on Issue 3 after Issue 1 and 2.

Before implementation, briefly summarize your understanding, risks, and any simpler alternative you recommend. Then implement the smallest correct change that makes Debate hints-on-demand and Plan editable while preserving the full 5-step flow.
```

**Issue 1 — Shipped:** `DebateStep` now defaults to blank textarea. AI options/hints hidden behind "Give me a hint" toggle. Round 1 + Round 2 both think-first.

**Issue 2 — Shipped:** `PlanStep` fields (position, thesis, body argument/support/example, concession) are inline-editable textareas. Edited plan persists into `WritingStep` via updated `GO_TO_WRITING` action.

**~~Issue 3~~** — Resolved: set `GEMINI_API_KEY` in `.env.local`.

## Day6: 05/05/2026

### Issues from Codex PR review (PR #1) — verify before fixing

https://github.com/trankhanh040147/ielts-gym/pull/1
-> Verify first to consider should fix or not, fix it and add to AGENTS.md/CLAUDE.md or somewhere so we don't repeat

- [ ]**Task: Discuss next features to build**
- Review what's working, what's still broken, and what would move the product closest to "usable and sellable"
- Candidates: real AI feedback (FeedbackStep currently mocked), UI/visual polish (Claude Design), back-navigation between steps, session history, use Claude Routine to gather cool ideas

- [ ] **Task: Fix Codex P2 bug**

**P1 — Static export breaks API routes (`next.config.ts`)**

- Codex flag: `BUILD_TARGET=app` → `output: 'export'` omits all API route handlers. UI still calls `/api/debate/open` etc. With empty `NEXT_PUBLIC_API_URL`, every AI step fails in the Capacitor build.
- Verdict: **By design for Week 1** — spec explicitly states "Week 1: Web only (Vercel). Capacitor build requires `NEXT_PUBLIC_API_URL` set to Vercel URL." Not a bug to fix, but needs to be documented in `AGENTS.md` so it's not misread as a bug in future sessions.

**P2 — `request.json()` outside try block in API routes (`app/api/debate/open/route.ts`, `respond/route.ts`, `plan/generate/route.ts`)**

- Codex flag: if request body is malformed/empty, `await request.json()` throws before the try/catch, returning a 500 instead of mock fallback data. Breaks the "always fall back" guarantee.
- Verdict: **Legitimate bug — fix.** Move `request.json()` inside the try block in all three routes.

### Task ?: Update Write UI
- [ ] "Write" screen is missing Topic section

### Task 1: Fix issues

- [ ] Issue1: The plan generated not follow the opinion of user.
Test case: 
- **Topic**: In the modern world, some people argue that the primary purpose of a university education should be to provide students with the skills and knowledge needed for the workplace. Others, however, believe that the role of a university is to provide a broad range of knowledge, regardless of whether it is useful for a career. To what extent do you agree or disagree?
- **Angle**: Students should focus on practical, job-ready subjects
- **What is your strongest reason for this view?**: Adaptability — a flexible education prepares students for an uncertain job market
- **Plan generated**: 
Your position
University students should be free to choose subjects that genuinely interest them.
Thesis
Although practical subjects offer clear career pathways, allowing students to pursue their passions ultimately produces more motivated learners and more innovative graduates.
Body Paragraph 1

Argument
Student motivation is higher when studying a subject they care about.
Support
Intrinsic motivation leads to deeper engagement, better retention, and higher academic performance.
Example
Research by Deci and Ryan shows that self-determined learners outperform those driven purely by external rewards.
Body Paragraph 2

Argument
Diverse university study fosters the innovation that economies need.
Support
Many breakthroughs occur at the intersection of disciplines, which only happens when students explore freely.
Example
Steve Jobs credited his calligraphy class at Reed College with inspiring the typography of the first Macintosh.
Concession
Opponents argue that studying only practical subjects guarantees employment, but a degree alone does not ensure a job in a rapidly changing economy.

- [ ] Issue2: Introduce  example of "Research by Deci and Ryan" in Plan -> I don't think anybody know about that. Should we mention it as "The intrinsic motivation study of Ryan and Deci" ? 

### Task 2: Write the full MVP features doc

### Task 3: Implement next feature

## Day7: 08/05/2026

Goal: make the Plan step more useful and reversible without adding heavy draft/version management.

### Task 1: Copy plan

- [ ] Add `Copy plan` button in Plan step.
- [ ] Copy the current edited plan, not the original AI plan.
- [ ] Use Markdown/plain-text format so learners can paste into Notes, Docs, or chat.
- [ ] Show lightweight copied feedback after success.
- [ ] If clipboard fails, keep the plan visible and show a non-blocking error.

Copy format should be Markdown by default:

```md
# IELTS Writing Task 2 Plan

## Position
...

## Thesis
...

## Body Paragraph 1
- Argument: ...
- Support: ...
- Example: ...

## Body Paragraph 2
- Argument: ...
- Support: ...
- Example: ...

## Concession
...

## Writing Tips
- ...
```

### Task 2: Regenerate plan safely

- [ ] Add `Regenerate plan` button in Plan step.
- [ ] Clicking it returns user to Debate round 1.
- [ ] Keep previous opinion prefilled so user can edit it.
- [ ] Keep current plan in state while user is regenerating.
- [ ] Show `Back to current plan` from Debate when a plan already exists.
- [ ] Only replace current plan after a new plan is generated successfully or fallback plan is generated.

State behavior:

- Current plan remains the source of truth until replacement plan generation finishes.
- `Regenerate plan` should keep `userPosition` and `userArgument`; Debate starts at round 1 so user can edit the opinion first.
- `Back to current plan` returns to Plan without changing plan, position, argument, essay, or feedback.

### Acceptance criteria

- User can copy an edited plan as readable Markdown/text.
- User can try to regenerate without losing the current plan.
- User can change their mind and return to the current plan.
- The regenerate flow preserves the think-first behavior from Day 5.
- The full Prompt -> Debate -> Plan -> Write -> Feedback loop still works.

### Suggested implementation order

1. Add a plan-to-Markdown formatter and unit tests.
2. Add copy button behavior in `PlanStep`, including success/error UI state.
3. Add reducer actions for `RETURN_TO_DEBATE_FOR_REGEN` and `GO_TO_CURRENT_PLAN`.
4. Wire `Regenerate plan` from Plan to Debate round 1 while preserving the current plan.
5. Show `Back to current plan` in Debate only when a current plan exists.
6. Add tests for copy, regeneration navigation, plan preservation, and replacement after new generation.
7. Run verification commands: tests, lint, build, and manual 5-step flow.
