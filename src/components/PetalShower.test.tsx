import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PetalShower from './PetalShower';
import FloralBorder from './FloralBorder';

describe('PetalShower', () => {
  it('renders the requested number of petals at the origin', () => {
    const { container } = render(<PetalShower count={12} origin={{ x: 200, y: 150 }} />);

    const petals = container.querySelectorAll('.petal');
    expect(petals).toHaveLength(12);
    expect((petals[0] as HTMLElement).style.left).toBe('200px');
    expect((petals[0] as HTMLElement).style.top).toBe('150px');
  });

  it('is hidden from assistive technology', () => {
    const { container } = render(<PetalShower origin={{ x: 0, y: 0 }} />);

    expect(container.querySelector('.petal-shower')).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('FloralBorder', () => {
  it('renders decorative motifs that are hidden from assistive technology', () => {
    const { container } = render(<FloralBorder />);

    const border = container.querySelector('.floral-border');
    expect(border).toHaveAttribute('aria-hidden', 'true');
    expect(border?.querySelectorAll('svg.floral-motif').length).toBeGreaterThan(0);
  });
});
