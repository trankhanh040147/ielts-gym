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

## Day5: 05/05/2026
### Product issues to fix (from Day 4 review)

**Issue 1: Debate và Plan đang là "holy receipts" — user follow, không think**
- Vấn đề hiện tại: AI hiện ra position options và full structured plan ngay từ đầu. User chỉ việc chọn và tiếp tục — không cần tư duy gì. Điều này phá vỡ mục đích của debate step; nó là menu, không phải learning exercise.
- Hướng giải quyết: Chuyển sang mô hình "hints on demand". Default state là blank input — user phải tự thử viết position/argument trước. AI hints (pre-filled options, argument scaffolding) ẩn sau nút "Give me a hint", chỉ reveal khi user bấm vào khi bị stuck.
- Key principle: hints phải là lifeline, không phải default. AI nên react với những gì user viết ra, không phải hand them the answer trước khi họ thử.

**Issue 2: Plan là one-way — không revise được, không có ownership**
- Vấn đề hiện tại: Sau debate, plan được generate và present như final. User không thể push back, edit từng section, hay nói với AI "tôi muốn đổi argument cho Body Paragraph 2." Plan bị áp đặt thay vì co-authored.
- Hướng giải quyết: Làm Plan step editable và revisable. Hai sub-problems:
  - (a) Free-text edit: cho user trực tiếp edit các field trong plan (position, thesis, body arguments) trước khi write.

## Day6: 05/05/2026
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

