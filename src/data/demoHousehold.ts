import type { Household } from '../lib/households';

export const demoHousehold: Household = {
  householdCode: 'demo',
  greetingName: 'The Demo Family',
  side: 'both',
  plusOneAllowed: true,
  guests: [
    { id: 'demo-guest-1', name: 'Alex Demo' },
    { id: 'demo-guest-2', name: 'Sam Demo' },
  ],
};
