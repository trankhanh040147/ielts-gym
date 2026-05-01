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
