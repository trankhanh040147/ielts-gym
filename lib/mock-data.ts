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
