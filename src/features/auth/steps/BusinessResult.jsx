import Note from '@/components/Note';

export default function BusinessResult({ check, className }) {
  return (
    <Note tone={check.verified ? 'ok' : 'warn'} className={className}>
      <b>{check.title}.</b> {check.text}
    </Note>
  );
}
