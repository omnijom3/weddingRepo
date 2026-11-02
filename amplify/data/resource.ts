import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Household: a
    .model({
      householdCode: a.string().required(), // Primary Key (e.g. ROSIE-JOE-401)
      familyName: a.string().required(),   // e.g. "The Smith Family"
      guests: a.json().array(),             // Array of guest objects
      rsvpSubmitted: a.boolean().default(false),
      notes: a.string(),
    })
    .identifier(['householdCode'])
    .authorization((allow) => [allow.publicApiKey()]), // Allows guests to read/write using code
  RSVP: a
    .model({
      fullName: a.string().required(),
      attending: a.boolean().required(),
      mealChoice: a.string().required(),
      dietaryNotes: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 30 },
  },
});