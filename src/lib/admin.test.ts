import { describe, expect, it } from 'vitest';
import { householdsCsv, rsvpsCsv, summariseHouseholds, toCsv } from './admin';

const households = [
  {
    householdCode: 'b-code',
    greetingName: 'The Smith Family',
    side: 'both' as const,
    guests: [
      { id: 'b-1', name: 'Anna Smith' },
      { id: 'b-2', name: 'Ben Smith' },
    ],
  },
  {
    householdCode: 'a-code',
    greetingName: 'Jane Doe',
    side: 'rosie' as const,
    guests: [{ id: 'a-1', name: 'Jane Doe' }],
  },
];

describe('summariseHouseholds', () => {
  it('counts completed steps and sorts by greeting name', () => {
    const summaries = summariseHouseholds(
      households,
      [
        {
          householdCode: 'b-code',
          guestId: 'b-1',
          guestName: 'Anna Smith',
          attending: true,
          mealChoice: 'Beef',
          dietaryNotes: null,
        },
      ],
      [
        { householdCode: 'b-code', step: 'invite-opened', completedAt: '2027-01-01T00:00:00Z' },
        { householdCode: 'b-code', step: 'rsvp-submitted', completedAt: '2027-01-02T00:00:00Z' },
      ],
    );

    expect(summaries.map((s) => s.greetingName)).toEqual(['Jane Doe', 'The Smith Family']);
    const smith = summaries[1];
    expect(smith.completedCount).toBe(2);
    expect(smith.totalSteps).toBe(4);
    expect(smith.completed['rsvp-submitted']).toBe(true);
    expect(smith.completed['envelope-opened']).toBe(false);
    expect(smith.rsvpCount).toBe(1);
  });

  it('shows zero progress for households with no activity', () => {
    const [doe] = summariseHouseholds(households.slice(1), [], []);
    expect(doe.completedCount).toBe(0);
    expect(doe.rsvpCount).toBe(0);
  });
});

describe('toCsv', () => {
  it('quotes cells containing commas, quotes or newlines', () => {
    expect(toCsv(['a'], [['x, "y"\nz']])).toBe('a\r\n"x, ""y""\nz"\r\n');
  });

  it('neutralises spreadsheet formula injection', () => {
    expect(toCsv(['a'], [['=HYPERLINK("x")']])).toBe('a\r\n"\'=HYPERLINK(""x"")"\r\n');
  });
});

describe('householdsCsv', () => {
  it('writes one row per household with step columns', () => {
    const summaries = summariseHouseholds(
      households.slice(1),
      [],
      [{ householdCode: 'a-code', step: 'invite-opened', completedAt: '2027-01-01T00:00:00Z' }],
    );
    const lines = householdsCsv(summaries).trim().split('\r\n');

    expect(lines[0]).toBe(
      'household_code,greeting_name,side,guests,rsvps_received,Opened invite,Watched intro,Opened envelope,Sent RSVP,steps_completed',
    );
    expect(lines[1]).toBe('a-code,Jane Doe,rosie,Jane Doe,0,Yes,No,No,No,1/4');
  });
});

describe('rsvpsCsv', () => {
  it('lists every guest, including those who have not responded', () => {
    const csv = rsvpsCsv(households, [
      {
        householdCode: 'b-code',
        guestId: 'b-1',
        guestName: 'Anna Smith',
        attending: false,
        mealChoice: 'N/A',
        dietaryNotes: 'None',
      },
    ])
      .trim()
      .split('\r\n');

    expect(csv).toHaveLength(4);
    expect(csv[1]).toBe('b-code,The Smith Family,both,b-1,Anna Smith,Declined,,');
    expect(csv[2]).toBe('b-code,The Smith Family,both,b-2,Ben Smith,No response,,');
  });
});
