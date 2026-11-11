import { FREE_EMAIL_PROVIDER } from '@/data/options';

export const BUSINESS_CHECKS = {
  match: {
    verified: true,
    steps: [
      ['ok', 'Email code confirmed'],
      ['ok', 'Email domain matches the company website'],
      ['ok', 'Business found in the state register'],
    ],
    title: 'Business verified',
    text: 'Your jobs go live as soon as you publish them, with the Verified employer mark.',
  },
  review: {
    verified: false,
    steps: [
      ['ok', 'Email code confirmed'],
      ['hold', 'Free email provider, so it can’t be matched to the website'],
      ['hold', 'Business details sent to a reviewer'],
    ],
    title: 'Sent for review',
    text: 'A person checks your business, usually within 1 business day. You can set up your company page and draft jobs now; they go live when the check passes.',
  },
};

export const checkFor = (email) => BUSINESS_CHECKS[FREE_EMAIL_PROVIDER.test(email) ? 'review' : 'match'];
