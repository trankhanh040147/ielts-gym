import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '@/app/page'

describe('Home flow fallback behavior', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network down'))
  })

  it('continues through debate and plan when API requests fail', async () => {
    const user = userEvent.setup()
    render(<Home />)

    await user.type(
      screen.getByRole('textbox'),
      'Some people think children should start school early. To what extent do you agree?'
    )
    await user.click(screen.getByRole('button', { name: /Start debate/ }))

    expect(await screen.findByText("Let's find your angle")).toBeInTheDocument()
    expect(screen.getByText(/children should start school early/)).toBeInTheDocument()

    await user.type(
      screen.getByRole('textbox'),
      'Children should not start formal school too early.'
    )
    await user.click(screen.getByRole('button', { name: /Continue/ }))

    expect(await screen.findByText('What is your strongest reason for this view?')).toBeInTheDocument()
    expect(screen.getByText(/Children should not start formal school too early/)).toBeInTheDocument()

    await user.type(
      screen.getByRole('textbox'),
      'Adaptability prepares students for an uncertain job market.'
    )
    await user.click(screen.getByRole('button', { name: /Generate my essay plan/ }))

    expect(await screen.findByText('Your Essay Plan')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Children should not start formal school too early.')).toBeInTheDocument()
  })
})
