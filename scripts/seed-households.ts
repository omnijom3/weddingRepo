import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Amplify } from 'aws-amplify';
import { signIn } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';
import { parseGuestsCsv, type GuestRow } from './generate-invites';

const GUESTS_CSV = process.env.GUESTS_CSV ?? 'path/to/guests.csv';
const OUTPUTS_FILE = process.env.AMPLIFY_OUTPUTS ?? 'amplify_outputs.json';

function toGuests(row: GuestRow) {
  return row.guests.map((name, index) => ({ id: `${row.householdId}-${index + 1}`, name }));
}

async function main() {
  const email = process.env.SEEDER_EMAIL;
  const password = process.env.SEEDER_PASSWORD;
  if (!email || !password) throw new Error('Set SEEDER_EMAIL and SEEDER_PASSWORD');

  const outputs = JSON.parse(readFileSync(resolve(OUTPUTS_FILE), 'utf8'));
  Amplify.configure(outputs);
  await signIn({ username: email, password });

  const client = generateClient<Schema>();
  const rows = parseGuestsCsv(readFileSync(resolve(GUESTS_CSV), 'utf8'));
  const codes = JSON.parse(readFileSync(resolve('invites/codes.json'), 'utf8')) as Record<
    string,
    string
  >;

  for (const row of rows) {
    const householdCode = codes[row.householdId];
    if (!householdCode)
      throw new Error(`No invite code for ${row.householdId}; run generate-invites first`);

    const input = {
      householdCode,
      greetingName: row.greetingName,
      side: row.side,
      guests: toGuests(row),
      plusOneAllowed: row.plusOneAllowed,
    };
    const authMode = 'userPool' as const;
    const existing = await client.models.Household.get({ householdCode }, { authMode });
    if (existing.errors?.length) throw new Error(existing.errors[0].message);

    const result = existing.data
      ? await client.models.Household.update(input, { authMode })
      : await client.models.Household.create(input, { authMode });
    if (result.errors?.length) throw new Error(result.errors[0].message);
  }

  console.log(`Seeded ${rows.length} households`);
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
