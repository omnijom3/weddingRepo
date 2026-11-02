import { client } from './amplifyClient';

export type Side = 'rosie' | 'joe' | 'both';

export type Guest = { id: string; name: string };

export type Household = {
  householdCode: string;
  greetingName: string;
  side: Side | null;
  guests: Guest[];
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
