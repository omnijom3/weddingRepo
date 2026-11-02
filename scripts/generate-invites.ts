import { randomBytes } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import QRCode from 'qrcode';

const ALPHABET = 'abcdefghijkmnopqrstuvwxyz23456789';
const CODE_LENGTH = 10;
const SIDES = ['rosie', 'joe', 'both'] as const;

export type Side = (typeof SIDES)[number];

export type GuestRow = {
  householdId: string;
  greetingName: string;
  side: Side;
  guests: string[];
};

export type Invite = GuestRow & { householdCode: string };

export function newCode(): string {
  let code = '';
  for (const byte of randomBytes(CODE_LENGTH)) {
    code += ALPHABET[byte % ALPHABET.length];
  }
  return code;
}

export function parseGuestsCsv(text: string): GuestRow[] {
  const [header, ...lines] = text.split(/\r?\n/).filter((line) => line.trim() !== '');
  const columns = header.split(',').map((column) => column.trim());
  const column = (name: string) => {
    const at = columns.indexOf(name);
    if (at === -1) throw new Error(`guests.csv is missing the "${name}" column`);
    return at;
  };
  const idAt = column('household_id');
  const greetingAt = column('greeting_name');
  const sideAt = column('side');
  const guestsAt = column('guests');

  return lines.map((line, row) => {
    const cells = line.split(',').map((cell) => cell.trim());
    const where = `Row ${row + 2}`;
    const householdId = cells[idAt];
    const greetingName = cells[greetingAt];
    const side = cells[sideAt];
    const guests = (cells[guestsAt] ?? '')
      .split(';')
      .map((name) => name.trim())
      .filter(Boolean);

    if (!householdId) throw new Error(`${where}: household_id is required`);
    if (!greetingName) throw new Error(`${where}: greeting_name is required`);
    if (!(SIDES as readonly string[]).includes(side)) {
      throw new Error(`${where}: side must be rosie, joe or both`);
    }
    if (guests.length === 0) throw new Error(`${where}: at least one guest is required`);

    return { householdId, greetingName, side: side as Side, guests };
  });
}

export function assignCodes(
  rows: GuestRow[],
  existing: Record<string, string>,
  makeCode: () => string = newCode,
): { invites: Invite[]; codes: Record<string, string> } {
  const codes = { ...existing };
  const taken = new Set(Object.values(codes));

  const invites = rows.map((row) => {
    let code = codes[row.householdId];
    if (!code) {
      do {
        code = makeCode();
      } while (taken.has(code));
      taken.add(code);
      codes[row.householdId] = code;
    }
    return { ...row, householdCode: code };
  });

  return { invites, codes };
}

export function inviteUrl(baseUrl: string, code: string): string {
  return `${baseUrl.replace(/\/$/, '')}/i/${code}`;
}

async function main() {
  const baseUrl = process.env.INVITE_BASE_URL;
  if (!baseUrl) throw new Error('Set INVITE_BASE_URL, e.g. https://example.com');

  const root = resolve('.');
  const outDir = join(root, 'invites');
  const codesPath = join(outDir, 'codes.json');
  const existing = existsSync(codesPath)
    ? (JSON.parse(readFileSync(codesPath, 'utf8')) as Record<string, string>)
    : {};

  const rows = parseGuestsCsv(readFileSync(join(root, 'guests.csv'), 'utf8'));
  const { invites, codes } = assignCodes(rows, existing);

  mkdirSync(join(outDir, 'qr'), { recursive: true });
  writeFileSync(codesPath, `${JSON.stringify(codes, null, 2)}\n`);

  const csv = ['household_id,greeting_name,side,household_code,url'];
  const qrOptions = { errorCorrectionLevel: 'Q' as const, margin: 6, width: 1024 };
  for (const invite of invites) {
    const url = inviteUrl(baseUrl, invite.householdCode);
    csv.push(
      [invite.householdId, `"${invite.greetingName}"`, invite.side, invite.householdCode, url].join(
        ',',
      ),
    );
    const qrPath = join(outDir, 'qr', invite.householdCode);
    await QRCode.toFile(`${qrPath}.png`, url, qrOptions);
    writeFileSync(`${qrPath}.svg`, await QRCode.toString(url, { ...qrOptions, type: 'svg' }));
  }
  writeFileSync(join(outDir, 'invites.csv'), `${csv.join('\n')}\n`);

  console.log(`Wrote ${invites.length} invites to ${outDir}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main().catch((err: unknown) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  });
}
