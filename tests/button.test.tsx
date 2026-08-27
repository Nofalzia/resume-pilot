import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '@/components/ui/Button'

describe('Button', () => {
  it('disables the control and shows a loading indicator while loading', () => {
    render(<Button loading>Analyze resume</Button>)
    const button = screen.getByRole('button', { name: 'Analyze resume' })

    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-disabled', 'true')
    expect(button.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
  })

  it('forwards user clicks when enabled', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Continue</Button>)

    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))

    expect(onClick).toHaveBeenCalledOnce()
  })
})