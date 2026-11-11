import { ButtonLink } from '@/components/Button';
import { Chip } from '@/components/Chip';
import Note from '@/components/Note';
import { PIPELINE_STAGES } from '@/data/options';
import { useAppStore } from '@/store';
import styles from './employer.module.css';

export function HoldNote() {
  const verified = useAppStore((state) => state.employer.verified);
  if (verified) return null;
  return (
    <Note
      tone="warn"
      className={styles.hold}
      action={
        <ButtonLink size="sm" to="/settings/company">
          See status
        </ButtonLink>
      }
    >
      <b>Your business check is in review.</b> Usually within 1 business day. You can edit your page and draft jobs;
      jobs go live and invites unlock when it passes.
    </Note>
  );
}

export function JobStatus({ status }) {
  const verified = useAppStore((state) => state.employer.verified);
  if (status === 'draft') return <Chip>Draft</Chip>;
  if (status === 'closed') return <Chip>Closed</Chip>;
  return verified ? <Chip tone="ok">Live</Chip> : <Chip tone="warn">Held until verified</Chip>;
}

export function PipelineBar({ pipeline }) {
  const total = pipeline.reduce((sum, count) => sum + count, 0);
  if (!total) return <span className="text-sm subtle">No candidates yet</span>;
  return (
    <div
      className={styles.pipeline}
      role="img"
      aria-label={pipeline.map((count, index) => `${count} ${PIPELINE_STAGES[index]}`).join(', ')}
    >
      {pipeline.map((count, index) =>
        count ? (
          <i key={index} className={styles[`stage${index}`]} style={{ width: `${(count / total) * 100}%` }} />
        ) : null,
      )}
    </div>
  );
}

export function PipelineLegend() {
  return (
    <p className={`text-xs subtle ${styles.legend}`}>
      {PIPELINE_STAGES.slice(0, 4).map((stage, index) => (
        <span key={stage}>
          <span className={`${styles.dot} ${styles[`stage${index}`]}`} />
          {stage}
        </span>
      ))}
    </p>
  );
}
