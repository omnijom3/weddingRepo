import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import RSVP from './RSVP';

const { householdGet, rsvpGet, rsvpCreate, rsvpUpdate } = vi.hoisted(() => ({
  householdGet: vi.fn(),
  rsvpGet: vi.fn(),
  rsvpCreate: vi.fn(),
  rsvpUpdate: vi.fn(),
}));

vi.mock('../lib/amplifyClient', () => ({
  client: {
    models: {
      Household: { get: householdGet },
      RSVP: { get: rsvpGet, create: rsvpCreate, update: rsvpUpdate },
    },
  },
}));

const household = {
  householdCode: 'abc123',
  greetingName: 'The Doe Family',
  side: 'both',
  guests: [
    { id: 'g1', name: 'Jane Doe' },
    { id: 'g2', name: 'Tom Doe' },
  ],
};

function renderRSVP() {
  return render(
    <MemoryRouter>
      <RSVP />
    </MemoryRouter>,
  );
}

async function enterCode(user: ReturnType<typeof userEvent.setup>, code = 'abc123') {
  await user.type(screen.getByLabelText(/invite code/i), code);
  await user.click(screen.getByRole('button', { name: /continue/i }));
  await screen.findByText('Jane Doe');
}

describe('RSVP form', () => {
  beforeEach(() => {
    sessionStorage.clear();
    householdGet.mockReset().mockResolvedValue({ data: household, errors: undefined });
    rsvpGet.mockReset().mockResolvedValue({ data: null, errors: undefined });
    rsvpCreate.mockReset().mockResolvedValue({ data: {}, errors: undefined });
    rsvpUpdate.mockReset().mockResolvedValue({ data: {}, errors: undefined });
  });

  it('shows an error when the invite code is not recognised', async () => {
    householdGet.mockResolvedValue({ data: null, errors: undefined });
    const user = userEvent.setup();
    renderRSVP();

    await user.type(screen.getByLabelText(/invite code/i), 'NOPE');
    await user.click(screen.getByRole('button', { name: /continue/i }));

    expect(await screen.findByText(/could not find that invite code/i)).toBeInTheDocument();
  });

  it('creates one RSVP per guest and shows the thank-you message', async () => {
    const user = userEvent.setup();
    renderRSVP();

    await enterCode(user);
    await user.click(screen.getByRole('button', { name: /send rsvp/i }));

    await waitFor(() => expect(screen.getByText(/thank you, the doe family/i)).toBeInTheDocument());
    expect(rsvpCreate).toHaveBeenCalledTimes(2);
    expect(rsvpCreate).toHaveBeenCalledWith({
      householdCode: 'abc123',
      guestId: 'g1',
      guestName: 'Jane Doe',
      side: 'both',
      attending: true,
      mealChoice: 'Beef',
      dietaryNotes: 'None',
    });
  });

  it('updates an existing RSVP instead of creating a duplicate', async () => {
    rsvpGet.mockImplementation(async ({ guestId }: { guestId: string }) => ({
      data: guestId === 'g1' ? { householdCode: 'abc123', guestId } : null,
      errors: undefined,
    }));
    const user = userEvent.setup();
    renderRSVP();

    await enterCode(user);
    await user.click(screen.getByRole('button', { name: /send rsvp/i }));

    await waitFor(() => expect(rsvpUpdate).toHaveBeenCalledTimes(1));
    expect(rsvpUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ householdCode: 'abc123', guestId: 'g1' }),
    );
    expect(rsvpCreate).toHaveBeenCalledTimes(1);
    expect(rsvpCreate).toHaveBeenCalledWith(expect.objectContaining({ guestId: 'g2' }));
  });

  it('records N/A for a guest who declines', async () => {
    const user = userEvent.setup();
    renderRSVP();

    await enterCode(user);
    await user.click(screen.getAllByLabelText(/regretfully declines/i)[1]);
    expect(screen.getAllByLabelText(/meal selection/i)).toHaveLength(1);

    await user.click(screen.getByRole('button', { name: /send rsvp/i }));

    await waitFor(() => expect(rsvpCreate).toHaveBeenCalledTimes(2));
    expect(rsvpCreate).toHaveBeenCalledWith(
      expect.objectContaining({ guestId: 'g2', attending: false, mealChoice: 'N/A' }),
    );
  });

  it('plays a photo pass when a side is chosen', async () => {
    const user = userEvent.setup();
    const { container } = renderRSVP();

    await enterCode(user);
    expect(container.querySelector('.photo-animation')).not.toBeInTheDocument();

    await user.click(screen.getByLabelText("Rosie's"));

    expect(container.querySelector('.photo-animation--rosie')).toBeInTheDocument();
  });

  it('shows an error banner when the request fails', async () => {
    rsvpCreate.mockRejectedValue(new Error('network'));
    const user = userEvent.setup();
    renderRSVP();

    await enterCode(user);
    await user.click(screen.getByRole('button', { name: /send rsvp/i }));

    expect(
      await screen.findByText(/something went wrong submitting your rsvp/i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/thank you/i)).not.toBeInTheDocument();
  });
});
