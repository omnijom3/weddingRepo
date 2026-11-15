import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Invite from './Invite';

const { householdGet, progressGet, progressCreate } = vi.hoisted(() => ({
  householdGet: vi.fn(),
  progressGet: vi.fn(),
  progressCreate: vi.fn(),
}));

vi.mock('../lib/amplifyClient', () => ({
  client: {
    models: {
      Household: { get: householdGet },
      RSVP: { get: vi.fn(), create: vi.fn(), update: vi.fn() },
      Progress: { get: progressGet, create: progressCreate },
    },
  },
}));

const household = {
  householdCode: 'abc123',
  greetingName: 'The Doe Family',
  side: 'both',
  guests: [{ id: 'g1', name: 'Jane Doe' }],
};

function renderInvite() {
  return render(
    <MemoryRouter initialEntries={['/i/abc123']}>
      <Routes>
        <Route path="/i/:code" element={<Invite />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('Invite replay intro', () => {
  beforeEach(() => {
    sessionStorage.clear();
    householdGet.mockReset().mockResolvedValue({ data: household, errors: undefined });
    progressGet.mockReset().mockResolvedValue({ data: null, errors: undefined });
    progressCreate.mockReset().mockResolvedValue({ data: {}, errors: undefined });
  });

  it('replays the intro from the invitation card without touching progress', async () => {
    const user = userEvent.setup();
    const { container } = renderInvite();

    await user.click(await screen.findByRole('button', { name: /skip intro/i }));
    await waitFor(() =>
      expect(container.querySelector('.cinematic-intro')).not.toBeInTheDocument(),
    );

    await user.click(await screen.findByRole('button', { name: 'Open the invitation' }));

    const progressCallsBefore = progressCreate.mock.calls.length;
    await user.click(await screen.findByRole('button', { name: /replay intro/i }));

    expect(container.querySelector('.cinematic-intro')).toBeInTheDocument();
    expect(progressCreate.mock.calls.length).toBe(progressCallsBefore);
  });
});
