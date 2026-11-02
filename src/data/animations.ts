export type PhotoVariant = 'rosie' | 'joe' | 'both';

export const photoSources: Record<PhotoVariant, string> = {
  rosie: '/photos/rosie.svg',
  joe: '/photos/joe.svg',
  both: '/photos/both.svg',
};

export const PHOTO_PASS_MS = 3200;
