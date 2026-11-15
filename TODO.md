# Wedding site: remaining work

Status as of 2026-11-15. Branch: `feature/JOE-0212`.

## Blocking: guest list

- [ ] Create `guests.csv` in the project root (copy `guests.example.csv`, replace with real households).
- [ ] Check `household_id` values are unique and will not change once invites are generated.
- [ ] Run the invite generator: `INVITE_BASE_URL=https://<site> npx tsx scripts/generate-invites.ts`
- [ ] Check `invites/invites.csv` and print or send the QR codes/links.
- [ ] Keep `invites/codes.json` safe. Losing it changes every printed link.

**Heads up:** the plus-one column is optional. Add `has_plus_one` (or `has plus one`) to the CSV header if you want plus-ones. Any value other than empty or `false` enables one.

## Backend (AWS, Amplify Gen 2)

- [ ] Get the right AWS account active on this machine. The local Amplify is not attached to it yet.
- [ ] Generate a real `amplify_outputs.json` by deploying the backend. The current file is a `{}` placeholder and is gitignored.
- [ ] Create the admin Cognito user (in the `admins` group).
- [ ] Create the seeder Cognito user (in the `seeder` group).
- [ ] Run the seed: `SEEDER_EMAIL=... SEEDER_PASSWORD=... GUESTS_CSV=guests.csv npx tsx scripts/seed-households.ts`
- [ ] Test admin login, household list, RSVP view and CSV export against the real backend.
- [ ] Test the guest flow end to end on a real invite link: intro, envelope, RSVP, progress steps.

## Feature: plus-ones

Requested: guests with a `has plus one` value other than `false` or empty can add a plus-one on the RSVP form. The plus-one has a blank name field, which is added to the household when submitted.

- [x] Confirm the CSV format: column `has_plus_one` (or `has plus one`); any value other than empty or `false` enables it.
- [x] Parser: add the column to `scripts/generate-invites.ts` and carry it into the seed.
- [x] Data model: store the plus-one flag on `Household`, and let the RSVP form add an extra guest with a blank name.
- [x] RSVP form: show the plus-one section only for eligible households. It uses the same attending and meal fields as other guests.
- [x] Decide how a plus-one with a blank name is stored (the name must be filled in before submit, or it is saved as "Plus one" plus the household name).
- [x] Admin export: include plus-ones in the household and RSVP CSVs.
- [x] Tests for parsing, form behaviour and export.

## Feature: RSVP feature flag and notification sign-up

Requested: until the flag is removed, anyone visiting `/rsvp` sees a simple form instead of the RSVP. That form collects an email and/or phone number (at least one required) and the household code, saved to a notifications list so you can email people when the RSVP opens or is updated.

- [x] Choose the flag mechanism (environment variable, a constant in `src/data/`, or a remote flag). Simplest: a constant plus `VITE_RSVP_ENABLED`.
- [x] Add a `NotificationSignup` model (householdCode, email, phone, createdAt). Guests can create, admins can read.
- [x] Build the sign-up form, with validation requiring at least one of email or phone.
- [x] Add a CSV export for the notifications list in the admin page.
- [ ] Decide how emails are sent later (e.g. SES) and who owns that. Sending is out of scope for now.
- [x] Tests for the flag, validation and submission.

## Code state

- [ ] **Uncommitted work:** the Replay intro button (`src/pages/Home.tsx`, `src/pages/Invite.tsx`, `src/pages/Invite.test.tsx`), the dev-only `/i/demo` replay (`src/pages/Invite.tsx`), and the name whitespace cleanup (`scripts/generate-invites.ts` and its test). Commit once checked.
- [ ] Browser-check the photo pass on `/rsvp` for Rosie, Joe and Both.
- [ ] Browser-check the Replay intro button on a real invite.
- [ ] Check the Travel and FAQ pages with the cream panel, including narrow mobile widths.
- [ ] Confirm the photo behaviour: Rosie/Joe picks show their own photo, and submit shows the chosen side's photo. Meal changes no longer show a photo.

## Test suite

- [ ] `npx vitest run` hangs after all tests pass. Each file passes alone, and groups pass together. Find the handle or timer that keeps the process alive.
- [ ] The `scripts/generate-invites.test.ts` whitespace case has not run under vitest (it also hangs). It was checked directly with tsx.
- [ ] Re-run typecheck, eslint and prettier before committing.

## Security and privacy

- [ ] Invite codes are the only protection for each household's data. Anyone with a code can read that household and write RSVPs for it. Accept this or add a stronger check before go-live.
- [ ] The GitHub repo is **public**. Guest CSVs, `invites/`, and `amplify_outputs.json` must stay out of git. They are gitignored; re-check before each push.
- [ ] Notifications data (emails and phone numbers) is personal data. Decide retention and who can export it.

## Cleanup

- [ ] Decide whether to remove the partial Python install (`C:\Python312`) and the stray `~umpy` folder under `AppData\Roaming\Python\Python312\site-packages`. Not needed for the site.
- [ ] Remove `demo` branch-only behaviour if it is not wanted in production (`src/lib/households.ts` and `src/data/demoHousehold.ts` are dev-only).

## Done (for reference)

- Admin area: read-only login, household list, progress tracking, RSVP view, CSV export.
- Progress model recorded at invite opened, intro complete, envelope opened, and RSVP submitted.
- Seed script and invite generator.
- Schedule readability, active nav state, RSVP nav link matches others.
- Photo pass uses Rosie, Joe and Both cutouts.
- Pushed to GitHub: commit `3f1b47a` on `feature/JOE-0212`.
