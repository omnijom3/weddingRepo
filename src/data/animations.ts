export type PhotoVariant = 'rosie' | 'joe' | 'both';

export const photoSources: Record<PhotoVariant, string> = {
  rosie: '/photos/rosie.png',
  joe: '/photos/joe.png',
  both: '/photos/both.png',
};

export const PHOTO_PASS_MS = 3200;
