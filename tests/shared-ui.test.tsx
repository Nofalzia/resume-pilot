import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { AnalysisCardSkeleton, Skeleton } from '@/components/ui/Skeleton'
import { Textarea } from '@/components/ui/Textarea'

describe('shared UI components', () => {
  it('renders badge variants and the larger size', () => {
    const { rerender } = render(<Badge variant="accent">Matched</Badge>)
    expect(screen.getByText('Matched')).toHaveStyle({ fontSize: '11px' })

    rerender(<Badge variant="success" size="md">Good</Badge>)
    expect(screen.getByText('Good')).toHaveStyle({ fontSize: '13px' })
    rerender(<Badge variant="warning">Needs work</Badge>)
    rerender(<Badge variant="danger">Poor</Badge>)
    rerender(<Badge variant="info">Info</Badge>)
    rerender(<Badge>Neutral</Badge>)
    expect(screen.getByText('Neutral')).toBeInTheDocument()
  })

  it('renders an empty state with optional content and action', () => {
    render(<EmptyState icon="!" title="No results" description="Run an analysis first." action={<button>Start</button>} />)

    expect(screen.getByText('No results')).toBeInTheDocument()
    expect(screen.getByText('Run an analysis first.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument()
  })

  it('explains rate limits and invokes retry', () => {
    const onRetry = vi.fn()
    render(<ErrorState message="Please wait." code="RATE_LIMITED" onRetry={onRetry} />)

    expect(screen.getByText('Service temporarily busy')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('supports textarea descriptions, errors, and near-limit counts', () => {
    const { rerender } = render(
      <Textarea label="Resume" description="Plain text works best." value="12345678" maxChars={10} onChange={() => {}} />,
    )
    expect(screen.getByLabelText('Resume')).toHaveAttribute('aria-describedby')
    expect(screen.getByText('8 / 10')).toBeInTheDocument()

    rerender(<Textarea label="Resume" value="12345678901" maxChars={10} error="Too long" onChange={() => {}} />)
    expect(screen.getByLabelText('Resume')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Too long')).toHaveAttribute('role', 'alert')
    fireEvent.focus(screen.getByLabelText('Resume'))
    fireEvent.blur(screen.getByLabelText('Resume'))
  })

  it('renders skeleton placeholders with configurable dimensions', () => {
    const { container } = render(<Skeleton height={32} width="50%" />)
    expect(container.firstElementChild).toHaveStyle({ height: '32px', width: '50%' })

    render(<AnalysisCardSkeleton />)
    expect(document.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThan(1)
  })
})
