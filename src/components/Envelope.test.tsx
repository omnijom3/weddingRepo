import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Envelope from './Envelope';

describe('Envelope open hint', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the click hint after 25 seconds while closed', () => {
    render(<Envelope isOpen={false} onOpen={() => {}} />);

    expect(screen.queryByText('Click to open')).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(25_000);
    });

    expect(screen.getByText('Click to open')).toBeInTheDocument();
  });

  it('hides the hint once the envelope is opened', () => {
    const { rerender } = render(<Envelope isOpen={false} onOpen={() => {}} />);

    act(() => {
      vi.advanceTimersByTime(25_000);
    });
    expect(screen.getByText('Click to open')).toBeInTheDocument();

    rerender(<Envelope isOpen onOpen={() => {}} />);

    expect(screen.queryByText('Click to open')).not.toBeInTheDocument();
  });

  it('calls onOpen when the bow is tapped', () => {
    const onOpen = vi.fn();
    render(<Envelope isOpen={false} onOpen={onOpen} />);

    fireEvent.click(screen.getByRole('button', { name: 'Open the invitation' }));

    expect(onOpen).toHaveBeenCalledTimes(1);
  });
});
