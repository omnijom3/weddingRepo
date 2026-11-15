import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { rememberHouseholdCode } from '../lib/households';
import NotificationSignupForm from './NotificationSignupForm';

const { householdGet, notificationCreate } = vi.hoisted(() => ({
  householdGet: vi.fn(),
  notificationCreate: vi.fn(),
}));

vi.mock('../lib/amplifyClient', () => ({
  client: {
    models: {
      Household: { get: householdGet },
      NotificationSignup: { create: notificationCreate },
    },
  },
}));

function renderForm() {
  return render(
    <MemoryRouter>
      <NotificationSignupForm />
    </MemoryRouter>,
  );
}

describe('NotificationSignupForm', () => {
  beforeEach(() => {
    sessionStorage.clear();
    rememberHouseholdCode('abc123');
    householdGet.mockReset().mockResolvedValue({
      data: {
        householdCode: 'abc123',
        greetingName: 'The Doe Family',
        side: 'both',
        guests: [],
        plusOneAllowed: false,
      },
      errors: undefined,
    });
    notificationCreate.mockReset().mockResolvedValue({ data: {}, errors: undefined });
  });

  it('requires an email or a phone number', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole('button', { name: /notify me/i }));

    expect(
      await screen.findByText(/enter an email address or a phone number/i),
    ).toBeInTheDocument();
    expect(notificationCreate).not.toHaveBeenCalled();
  });

  it('saves the household code with whichever contact was given', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/phone number/i), '0871234567');
    await user.click(screen.getByRole('button', { name: /notify me/i }));

    await waitFor(() => expect(notificationCreate).toHaveBeenCalledTimes(1));
    expect(notificationCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        householdCode: 'abc123',
        phone: '0871234567',
        email: undefined,
      }),
    );
    expect(await screen.findByText(/thank you/i)).toBeInTheDocument();
  });
});
