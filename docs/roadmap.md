- Time can spend: 1h/weekday, 3h/weekend

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

## Day2: 29/04/2026 - Next
- Làm rõ lại workflow design: Mình có thể tận dụng Claude Design để thiết kế design cho sản phẩm, bước này nên làm khi nào ?
- Handoff cho Claude Code bắt đầu bằng brainstorming trước khi implement.
- Dựng demo skeleton cho flow: prompt -> debate ideas -> outline -> essay editor -> feedback.
- Có thể dùng mocked AI responses trước để đảm bảo user thấy được toàn bộ luồng.
