import { render, screen } from '@testing-library/react'
import FeedbackStep from '@/components/steps/FeedbackStep'
import type { MockedFeedback } from '@/lib/schemas'

describe('FeedbackStep', () => {
  it('renders feedback passed from app state', () => {
    const feedback: MockedFeedback = {
      band_estimate: '7.0',
      top_issues: [
        {
          title: 'Specific custom issue',
          why_it_matters: 'This proves the component is not using the default mock.',
          fix: 'Use the feedback prop.',
        },
      ],
      rewrite_sample: 'A custom rewrite sample.',
      next_actions: ['A custom next action.'],
    }

    render(<FeedbackStep feedback={feedback} onStartOver={jest.fn()} />)

    expect(screen.getByText('7.0')).toBeInTheDocument()
    expect(screen.getByText('Specific custom issue')).toBeInTheDocument()
    expect(screen.getByText('A custom next action.')).toBeInTheDocument()
  })
})
