import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Household: a
    .model({
      householdCode: a.string().required(),
      greetingName: a.string().required(),
      side: a.enum(['rosie', 'joe', 'both']),
      guests: a.json().array().required(),
      notes: a.string(),
    })
    .identifier(['householdCode'])
    .authorization((allow) => [allow.guest().to(['get']), allow.authenticated('userPools')]),
  RSVP: a
    .model({
      householdCode: a.string().required(),
      guestId: a.string().required(),
      guestName: a.string().required(),
      side: a.enum(['rosie', 'joe', 'both']),
      attending: a.boolean().required(),
      mealChoice: a.string().required(),
      dietaryNotes: a.string(),
    })
    .identifier(['householdCode', 'guestId'])
    .authorization((allow) => [
      allow.guest().to(['create', 'update', 'get']),
      allow.authenticated('userPools'),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'identityPool',
  },
});
