import { describe, expect, it } from 'vitest';
import { assignCodes, inviteUrl, parseGuestsCsv } from './generate-invites';

describe('parseGuestsCsv', () => {
  it('reads households and splits guests on semicolons', () => {
    const rows = parseGuestsCsv(
      'household_id,greeting_name,side,guests\nsmith,The Smith Family,both,Anna Smith;Ben Smith\n',
    );

    expect(rows).toEqual([
      {
        householdId: 'smith',
        greetingName: 'The Smith Family',
        side: 'both',
        guests: ['Anna Smith', 'Ben Smith'],
      },
    ]);
  });

  it('rejects an unknown side', () => {
    expect(() =>
      parseGuestsCsv('household_id,greeting_name,side,guests\nx,Name,groom,Pat\n'),
    ).toThrow(/side must be/);
  });
});

describe('assignCodes', () => {
  const rows = [
    { householdId: 'a', greetingName: 'A', side: 'both' as const, guests: ['Pat'] },
    { householdId: 'b', greetingName: 'B', side: 'joe' as const, guests: ['Sam'] },
  ];

  it('keeps existing codes so re-runs never change a printed invite', () => {
    const first = assignCodes(rows, {}, () => 'code1');
    const second = assignCodes(rows, first.codes, () => 'never-used');

    expect(second.invites.map((i) => i.householdCode)).toEqual(['code1', 'code1']);
  });

  it('gives each household a unique code', () => {
    const codes = ['same', 'same', 'other'];
    const { invites } = assignCodes(rows, {}, () => codes.shift() ?? 'fallback');

    expect(new Set(invites.map((i) => i.householdCode)).size).toBe(2);
  });
});

describe('inviteUrl', () => {
  it('joins the base URL and code without doubling slashes', () => {
    expect(inviteUrl('https://example.com/', 'abc')).toBe('https://example.com/i/abc');
  });
});
