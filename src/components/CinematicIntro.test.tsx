import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CinematicIntro from './CinematicIntro';

describe('CinematicIntro', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the lines one at a time and then calls onDone', () => {
    const onDone = vi.fn();
    render(<CinematicIntro lines={['First', 'Second']} onDone={onDone} />);

    expect(screen.getByText('First')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2200);
    });
    expect(screen.getByText('Second')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2200);
    });
    expect(onDone).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1200);
    });
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('calls onDone immediately when skipped', () => {
    const onDone = vi.fn();
    render(<CinematicIntro lines={['First']} onDone={onDone} />);

    fireEvent.click(screen.getByRole('button', { name: /skip intro/i }));

    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
