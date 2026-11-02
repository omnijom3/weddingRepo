export const wedding = {
  couple: 'Rosie & Joe',
  date: 'Friday, August 13th, 2027',
  venue: 'Conyngham Arms Hotel',
  venueLocation: 'Slane, Co. Meath',
  venueAddress: 'Main Street, Slane, Co. Meath, C15 A272',
  ceremonyTime: '1:30 PM',
  rsvpDeadline: 'June 1st, 2027',
} as const;

export const scheduleEvents = [
  {
    time: '1:00 PM',
    title: 'Guest Arrival',
    description: 'Welcome drinks in the main foyer at Conyngham Arms.',
  },
  {
    time: '1:30 PM',
    title: 'Ceremony Begins',
    description: 'Please be seated in the ceremony suite by 1:20 PM.',
  },
  {
    time: '2:30 PM',
    title: 'Drinks Reception & Photos',
    description: 'Enjoy prosecco, canopy, and live acoustics in the garden lounge.',
  },
  {
    time: '5:30 PM',
    title: 'Call to Dinner',
    description: 'Speeches followed by a 3-course dinner.',
  },
  {
    time: '8:30 PM',
    title: 'First Dance & Evening Party',
    description: 'The band takes the stage!',
  },
  { time: '11:00 PM', title: 'Late Night Food', description: 'Sliders and late snacks served.' },
] as const;

export const faqs = [
  {
    question: 'What is the dress code?',
    answer: 'Semi-formal / Cocktail attire. We want you to feel comfortable and ready to dance!',
  },
  {
    question: 'Are children invited?',
    answer:
      'Although we love your little ones, our wedding will be an adults-only event so everyone can relax and celebrate.',
  },
  {
    question: 'Can I bring a plus one?',
    answer:
      'Due to capacity restrictions at the venue, we can only accommodate guests formally listed on your invitation.',
  },
  {
    question: 'What is your registry / gift policy?',
    answer:
      'Your presence at our wedding is the greatest gift of all! If you wish to honor us with a gift, a cash contribution towards our honeymoon pool would be warmly appreciated.',
  },
] as const;

export const mealOptions = [
  { value: 'Beef', label: 'Roast Prime Rib of Beef' },
  { value: 'Salmon', label: 'Pan-Seared Atlantic Salmon' },
  { value: 'Vegetarian', label: 'Wild Mushroom & Herb Risotto (Vegetarian/Vegan)' },
] as const;
