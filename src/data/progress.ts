export const PROGRESS_STEPS = [
  { key: 'invite-opened', label: 'Opened invite' },
  { key: 'intro-complete', label: 'Watched intro' },
  { key: 'envelope-opened', label: 'Opened envelope' },
  { key: 'rsvp-submitted', label: 'Sent RSVP' },
] as const;

export type ProgressStep = (typeof PROGRESS_STEPS)[number]['key'];
