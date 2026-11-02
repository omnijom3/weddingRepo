import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PetalShower from './PetalShower';
import FloralBorder from './FloralBorder';

describe('PetalShower', () => {
  it('renders the requested number of petals', () => {
    const { container } = render(<PetalShower count={12} />);

    expect(container.querySelectorAll('.petal')).toHaveLength(12);
  });

  it('is hidden from assistive technology', () => {
    const { container } = render(<PetalShower />);

    expect(container.querySelector('.petal-shower')).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('FloralBorder', () => {
  it('renders the decorative border hidden from assistive technology', () => {
    const { container } = render(<FloralBorder />);

    expect(container.querySelector('.floral-border')).toHaveAttribute('aria-hidden', 'true');
  });
});
