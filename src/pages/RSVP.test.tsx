import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import RSVP from './RSVP';

const { create } = vi.hoisted(() => ({ create: vi.fn() }));

vi.mock('../lib/amplifyClient', () => ({
  client: { models: { RSVP: { create } } },
}));

function renderRSVP() {
  return render(
    <MemoryRouter>
      <RSVP />
    </MemoryRouter>,
  );
}

describe('RSVP form', () => {
  beforeEach(() => {
    create.mockReset();
  });

  it('submits the attending guest details and shows the thank-you message', async () => {
    create.mockResolvedValue({});
    const user = userEvent.setup();
    renderRSVP();

    await user.type(screen.getByLabelText(/full name/i), 'John & Sarah Smith');
    await user.selectOptions(screen.getByLabelText(/meal selection/i), 'Salmon');
    await user.click(screen.getByRole('button', { name: /send rsvp/i }));

    await waitFor(() =>
      expect(screen.getByText(/thank you, john & sarah smith/i)).toBeInTheDocument(),
    );
    expect(create).toHaveBeenCalledWith({
      fullName: 'John & Sarah Smith',
      attending: true,
      mealChoice: 'Salmon',
      dietaryNotes: 'None',
    });
  });

  it('shows an error banner when the request fails', async () => {
    create.mockRejectedValue(new Error('network'));
    const user = userEvent.setup();
    renderRSVP();

    await user.type(screen.getByLabelText(/full name/i), 'Jane Doe');
    await user.click(screen.getByRole('button', { name: /send rsvp/i }));

    expect(
      await screen.findByText(/something went wrong submitting your rsvp/i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/thank you/i)).not.toBeInTheDocument();
  });

  it('hides meal fields and records N/A when declining', async () => {
    create.mockResolvedValue({});
    const user = userEvent.setup();
    renderRSVP();

    await user.type(screen.getByLabelText(/full name/i), 'Jane Doe');
    await user.click(screen.getByLabelText(/regretfully declines/i));

    expect(screen.queryByLabelText(/meal selection/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/dietary requirements/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /send rsvp/i }));

    await waitFor(() => expect(create).toHaveBeenCalled());
    expect(create).toHaveBeenCalledWith({
      fullName: 'Jane Doe',
      attending: false,
      mealChoice: 'N/A',
      dietaryNotes: 'None',
    });
  });
});
