const shortDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
const longDate = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
const clock = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' });

export const todayShort = () => shortDate.format(new Date());

export const todayLong = () => longDate.format(new Date());

export const timeNow = () => clock.format(new Date()).replace('AM', 'am').replace('PM', 'pm');

export const greeting = () => {
  const hour = new Date().getHours();
  return hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
};

export const formatPay = ({ pay }) =>
  pay.unit === 'year' ? `$${pay.min}K–$${pay.max}K/yr` : `$${pay.min}–$${pay.max}/hr`;

export const hourlyRate = ({ pay }) => (pay.unit === 'year' ? Math.round((pay.min * 1000) / 2080) : pay.min);

export const postedAgo = (days) => (days <= 1 ? '1 day ago' : `${days} days ago`);

export const distanceLabel = (job) => (job.workplace === 'Remote' ? 'Remote' : `${job.miles} mi away`);

export const shortDistance = (job) => (job.workplace === 'Remote' ? 'Remote' : `${job.miles} mi`);

export const formatCount = (count) => count.toLocaleString('en-US');

export const plural = (count, word, many = `${word}s`) => `${count} ${count === 1 ? word : many}`;

export const initials = (name) =>
  name
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('');

export const firstName = (name) => name.split(' ')[0];
