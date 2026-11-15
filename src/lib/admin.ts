import { PROGRESS_STEPS, type ProgressStep } from '../data/progress';
import type { Side } from './households';

export type AdminHousehold = {
  householdCode: string;
  greetingName: string;
  side: Side | null;
  guests: { id: string; name: string }[];
};

export type AdminRsvp = {
  householdCode: string;
  guestId: string;
  guestName: string;
  attending: boolean;
  mealChoice: string;
  dietaryNotes: string | null;
};

export type AdminProgress = {
  householdCode: string;
  step: string;
  completedAt: string;
};

export type HouseholdSummary = {
  householdCode: string;
  greetingName: string;
  side: Side | null;
  guestNames: string[];
  completed: Record<ProgressStep, boolean>;
  completedCount: number;
  totalSteps: number;
  rsvpCount: number;
};

const STEP_KEYS = PROGRESS_STEPS.map((step) => step.key);

export function summariseHouseholds(
  households: AdminHousehold[],
  rsvps: AdminRsvp[],
  progress: AdminProgress[],
): HouseholdSummary[] {
  const done = new Map<string, Set<string>>();
  for (const entry of progress) {
    const steps = done.get(entry.householdCode) ?? new Set<string>();
    steps.add(entry.step);
    done.set(entry.householdCode, steps);
  }

  const responded = new Map<string, number>();
  for (const rsvp of rsvps) {
    responded.set(rsvp.householdCode, (responded.get(rsvp.householdCode) ?? 0) + 1);
  }

  return households
    .map((household) => {
      const steps = done.get(household.householdCode) ?? new Set<string>();
      const completed = Object.fromEntries(STEP_KEYS.map((key) => [key, steps.has(key)])) as Record<
        ProgressStep,
        boolean
      >;
      return {
        householdCode: household.householdCode,
        greetingName: household.greetingName,
        side: household.side,
        guestNames: household.guests.map((guest) => guest.name),
        completed,
        completedCount: STEP_KEYS.filter((key) => completed[key]).length,
        totalSteps: STEP_KEYS.length,
        rsvpCount: responded.get(household.householdCode) ?? 0,
      };
    })
    .sort((a, b) => a.greetingName.localeCompare(b.greetingName));
}

function escapeCell(value: string): string {
  const safe = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return /[",\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

export function toCsv(headers: string[], rows: string[][]): string {
  return [headers, ...rows].map((row) => row.map(escapeCell).join(',')).join('\r\n') + '\r\n';
}

export function householdsCsv(summaries: HouseholdSummary[]): string {
  const headers = [
    'household_code',
    'greeting_name',
    'side',
    'guests',
    'rsvps_received',
    ...PROGRESS_STEPS.map((step) => step.label),
    'steps_completed',
  ];
  const rows = summaries.map((summary) => [
    summary.householdCode,
    summary.greetingName,
    summary.side ?? '',
    summary.guestNames.join('; '),
    String(summary.rsvpCount),
    ...STEP_KEYS.map((key) => (summary.completed[key] ? 'Yes' : 'No')),
    `${summary.completedCount}/${summary.totalSteps}`,
  ]);
  return toCsv(headers, rows);
}

export function rsvpsCsv(households: AdminHousehold[], rsvps: AdminRsvp[]): string {
  const headers = [
    'household_code',
    'greeting_name',
    'side',
    'guest_id',
    'guest_name',
    'response',
    'meal',
    'dietary_notes',
  ];
  const byGuest = new Map(rsvps.map((rsvp) => [`${rsvp.householdCode}|${rsvp.guestId}`, rsvp]));

  const rows = households.flatMap((household) =>
    household.guests.map((guest) => {
      const rsvp = byGuest.get(`${household.householdCode}|${guest.id}`);
      return [
        household.householdCode,
        household.greetingName,
        household.side ?? '',
        guest.id,
        guest.name,
        rsvp ? (rsvp.attending ? 'Attending' : 'Declined') : 'No response',
        rsvp?.attending ? rsvp.mealChoice : '',
        rsvp?.attending ? (rsvp.dietaryNotes ?? '') : '',
      ];
    }),
  );
  return toCsv(headers, rows);
}
