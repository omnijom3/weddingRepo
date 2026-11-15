# Wedding site: project status and handover

Last updated 2026-11-15. Read this first if you are picking up the project.

Live site: `www` on the custom domain (Route 53). Amplify Hosting deploys `main`.

## Repository and security

- The GitHub repo is **public** (`omnijom3/weddingRepo`). Never commit real guest data.
- Gitignored and must stay out of git: `guests.csv`, `invites/` (codes, invite CSV, QR codes), `amplify_outputs.json`, `.env*`.
- `guests.example.csv` is committed and must contain placeholder names only. Keep real names in `guests.csv` locally.
- Seeder and admin passwords are supplied only through environment variables or a hidden prompt. Never write them to files.

## What the site does

**Public pages**

- Home, Schedule, Travel and FAQ. Content lives in `src/data/wedding.ts`.
- `/rsvp` is behind the feature flag (see below).

**Guest invite flow (`/i/<code>`)**

1. The guest opens a personal link. The code is the household's invite code.
2. The household is loaded from the backend. If the code is unknown, the guest sees a "not found" message.
3. The guest sees the cinematic intro. Watching it is recorded as progress. The intro is skipped on later visits in the same session.
4. The invitation is in an envelope. Opening it is recorded as progress and plays the petal animation.
5. The invitation card has an RSVP link and a **Replay intro** button. Replay restarts only the intro and does not reset the RSVP.
6. The RSVP form is reached from the invitation or `/rsvp`. The invite code is remembered in session storage, so the guest does not retype it.

**RSVP (`/rsvp`, when enabled)**

- Choose a side (Rosie's, Joe's or Both). Each choice plays the matching photo pass. The Both photo only plays when Both is chosen.
- Each guest answers Joyfully Accepts or Regretfully Declines. Attending guests choose a meal and can add dietary notes. Declining records meal `N/A`.
- **Plus-one:** if the household has `plusOneAllowed`, the guest can choose "Bringing a plus one". They must enter the plus-one's full name and choose a meal. The plus-one is saved to the household and to the RSVPs as `<code>-plus-one`.
- Re-submitting updates existing RSVPs instead of creating duplicates.

**RSVP feature flag and notification sign-up**

- `src/lib/featureFlags.ts` reads `VITE_RSVP_ENABLED`. Unless it is set to `true`, `/rsvp` shows `NotificationSignupForm` instead of the RSVP.
- The sign-up form needs the invite code from the guest's session. It asks for an email, a phone number, or both (at least one is required). Without a code in the session, it asks the guest to open their invitation link.
- Sign-ups are saved to the `NotificationSignup` model with the household code, email, phone and time. Admins can export them.
- Sending emails is not built. It is out of scope for now.

**Admin (`/admin`)**

- Sign-in with a Cognito user. The user must be in the `admins` group, or the page shows "does not have admin access".
- Shows households, RSVP status, guest progress steps and the RSVP view.
- Exports: households CSV, RSVPs CSV, notifications CSV.
- Read-only. Admins cannot edit households or RSVPs from the page.

**Progress tracking**

Recorded per household and step (`src/data/progress.ts`):

| Step key | When it is recorded |
| --- | --- |
| `invite-opened` | Invite link loads |
| `intro-complete` | Intro finishes |
| `envelope-opened` | Envelope is opened on Home |
| `rsvp-submitted` | RSVP is sent |

**Development-only demo**

- In `npm run dev`, `/i/demo` loads a built-in household with plus-ones enabled. It uses no backend. The intro replays on every visit to `/i/demo` for easy testing.
- The demo bypass is disabled in production builds.

## Data model (`amplify/data/resource.ts`)

| Model | Key | Access |
| --- | --- | --- |
| `Household` | `householdCode` | Guests: read by code. Seeder: create, update, read. Admins: read. |
| `RSVP` | `householdCode` + `guestId` | Guests: create, update, read. Admins: read. |
| `Progress` | `householdCode` + `step` | Guests: create, read. Admins: read. |
| `NotificationSignup` | auto | Guests: create. Admins: read. |

Auth is Cognito with email sign-in and two groups, `admins` and `seeder`. Self sign-up is disabled, so admins create users. Data uses the identity pool for guest access.

## Guest list and invites

**Guest CSV (`guests.csv`, local only)**

Columns:

- `household_id` (required, unique, never change it once invites are printed)
- `greeting_name` (required; the name on the invitation)
- `side` (required; `rosie`, `joe` or `both`)
- `guests` (required; names separated by `;`; whitespace is trimmed)
- `has plus one` or `has_plus_one` (optional; any value other than empty or `false` enables a plus-one)

The parser stops at the first bad row and reports its row number. Fix rows one at a time.

**Generate invites**

```
INVITE_BASE_URL=https://<your-domain> npx tsx scripts/generate-invites.ts
```

Writes `invites/codes.json` (code per household), `invites/invites.csv` and `invites/qr/` (PNG and SVG). Existing codes are kept, so re-running is safe. Back up `invites/codes.json`.

**Seed the backend**

```
read -s SEEDER_PASSWORD && export SEEDER_PASSWORD
export SEEDER_EMAIL=<seeder email> GUESTS_CSV=guests.csv
npm run seed
unset SEEDER_PASSWORD
```

Upserts each household. Needs `amplify_outputs.json` (see deployment).

## Deployment

- Amplify Hosting builds from `amplify.yml`: it deploys the backend with `ampx pipeline-deploy` and builds the frontend with `npm run build`.
- The custom domain is set up in Amplify and Route 53.
- `VITE_RSVP_ENABLED` is an Amplify environment variable. Leave it unset until the RSVP opens, then set it to `true` and redeploy.
- The admin and seeder users are created in the Cognito user pool that Amplify creates. A user created with a temporary password must set a permanent one before signing in. The admin page does not currently handle this step (see known issues).

## Testing and checks

```
npm run typecheck
npx eslint src scripts
npx vitest run <file>
```

- Run test files individually. The full `npx vitest run` hangs after all tests pass, so it is not reliable yet.
- The parser can be checked directly with `npx tsx` against `guests.csv`.

## Known issues

- **FAQ contradicts the plus-one feature.** `src/data/wedding.ts` says plus-ones are not allowed. Update the answer before the RSVP opens.
- **Temporary passwords are not handled.** Admin sign-in and the seed script both fail silently when Cognito asks for a new password. Set permanent passwords with `aws cognito-idp admin-set-user-password --permanent` first.
- **Full `vitest run` hangs.** See testing above.
- **Invite codes are the only protection.** Anyone with a code can read that household and submit RSVPs for it. Accept this or add a stronger check before go-live.
- **Notification data is personal.** Decide retention and who can export it.
- **Unverified on Ubuntu.** The code has no Windows-specific paths, but the full deploy has not been run from Ubuntu yet.

## Next steps

1. **Add the real guest list.** Copy `guests.example.csv` to `guests.csv`, replace the placeholder rows, and fix the malformed rows. Check the spellings against the invitation.
2. Run the invite generator and check `invites/invites.csv` and the QR codes.
3. Create the admin and seeder users in Cognito, and set their permanent passwords.
4. Run the seed, then check the admin page, the household list and the CSV exports.
5. Test a real invite link end to end: intro, envelope, RSVP and the progress steps.
6. Update the FAQ plus-one answer.
7. Keep `/rsvp` behind the flag until the RSVP opens. Set `VITE_RSVP_ENABLED=true` in Amplify then.
8. Decide how notification emails will be sent (for example SES) and who owns them.
9. Work through the security and cleanup items above before go-live.
