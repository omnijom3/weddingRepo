import { client } from './amplifyClient';
import type { ProgressStep } from '../data/progress';

export type Side = 'rosie' | 'joe' | 'both';

export type Guest = { id: string; name: string };

export type Household = {
  householdCode: string;
  greetingName: string;
  side: Side | null;
  guests: Guest[];
  plusOneAllowed: boolean;
};

export type RsvpAnswer = {
  guestId: string;
  guestName: string;
  attending: boolean;
  mealChoice: string;
  dietaryNotes: string;
};

const DEMO_CODE = 'demo';
const DEMO_RSVPS_KEY = 'demo-rsvps';
const REMEMBERED_CODE_KEY = 'household-code';

export function rememberHouseholdCode(code: string): void {
  sessionStorage.setItem(REMEMBERED_CODE_KEY, code);
}

export function rememberedHouseholdCode(): string | null {
  return sessionStorage.getItem(REMEMBERED_CODE_KEY);
}

export async function findHousehold(code: string): Promise<Household | null> {
  if (import.meta.env.DEV && code === DEMO_CODE) {
    const { demoHousehold } = await import('../data/demoHousehold');
    return demoHousehold;
  }

  const { data, errors } = await client.models.Household.get({ householdCode: code });
  if (errors?.length) throw new Error(errors[0].message);
  if (!data) return null;

  return {
    householdCode: data.householdCode,
    greetingName: data.greetingName,
    side: data.side ?? null,
    guests: (data.guests ?? []) as Guest[],
    plusOneAllowed: data.plusOneAllowed ?? false,
  };
}

export async function saveRsvps(
  householdCode: string,
  side: Side,
  answers: RsvpAnswer[],
): Promise<void> {
  if (import.meta.env.DEV && householdCode === DEMO_CODE) {
    const stored = JSON.parse(localStorage.getItem(DEMO_RSVPS_KEY) ?? '{}') as Record<
      string,
      RsvpAnswer & { side: Side }
    >;
    for (const answer of answers) {
      stored[answer.guestId] = { ...answer, side };
    }
    localStorage.setItem(DEMO_RSVPS_KEY, JSON.stringify(stored));
    return;
  }

  for (const answer of answers) {
    const key = { householdCode, guestId: answer.guestId };
    const existing = await client.models.RSVP.get(key);
    if (existing.errors?.length) throw new Error(existing.errors[0].message);

    const input = { ...key, ...answer, side };
    const result = existing.data
      ? await client.models.RSVP.update(input)
      : await client.models.RSVP.create(input);
    if (result.errors?.length) throw new Error(result.errors[0].message);
  }
}

export async function addPlusOneToHousehold(
  householdCode: string,
  guests: Guest[],
  plusOneName: string,
): Promise<Guest[]> {
  const plusOne = { id: `${householdCode}-plus-one`, name: plusOneName };
  const updated = [...guests.filter((guest) => guest.id !== plusOne.id), plusOne];
  if (import.meta.env.DEV && householdCode === DEMO_CODE) return updated;

  const result = await client.models.Household.update({ householdCode, guests: updated });
  if (result.errors?.length) throw new Error(result.errors[0].message);
  return updated;
}

export type NotificationSignup = { householdCode: string; email?: string; phone?: string };

export async function saveNotificationSignup(signup: NotificationSignup): Promise<void> {
  if (import.meta.env.DEV && signup.householdCode === DEMO_CODE) return;

  const result = await client.models.NotificationSignup.create({
    householdCode: signup.householdCode,
    email: signup.email,
    phone: signup.phone,
    createdAt: new Date().toISOString(),
  });
  if (result.errors?.length) throw new Error(result.errors[0].message);
}

export async function recordProgress(householdCode: string, step: ProgressStep): Promise<void> {
  if (import.meta.env.DEV && householdCode === DEMO_CODE) return;

  try {
    const key = { householdCode, step };
    const existing = await client.models.Progress.get(key);
    if (existing.errors?.length) throw new Error(existing.errors[0].message);
    if (existing.data) return;

    const result = await client.models.Progress.create({
      ...key,
      completedAt: new Date().toISOString(),
    });
    if (result.errors?.length) throw new Error(result.errors[0].message);
  } catch (err: unknown) {
    console.error(`Error recording progress step ${step}:`, err);
  }
}
