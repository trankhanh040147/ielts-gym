import { render, screen } from '@testing-library/react'
import WritingStep from '@/components/steps/WritingStep'
import type { EssayPlan } from '@/lib/schemas'

describe('WritingStep', () => {
  const plan: EssayPlan = {
    position: 'Students should study practical subjects.',
    thesis: 'Practical study helps students prepare for work.',
    body: [
      {
        label: 'Body Paragraph 1',
        argument: 'Job-ready skills matter.',
        support: 'They help graduates adapt quickly.',
        example: 'A coding graduate can contribute immediately.',
      },
    ],
    writing_tips: ['Use clear topic sentences.'],
  }

  it('shows the original topic while the learner writes', () => {
    render(
      <WritingStep
        prompt="Some people think universities should teach job-ready skills. Discuss both views."
        plan={plan}
        essay=""
        onEssayChange={jest.fn()}
        onGetFeedback={jest.fn()}
      />
    )

    expect(screen.getByText('Topic')).toBeInTheDocument()
    expect(
      screen.getByText('Some people think universities should teach job-ready skills. Discuss both views.')
    ).toBeInTheDocument()
  })
})
