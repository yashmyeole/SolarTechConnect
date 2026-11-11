import { cx } from '@/lib/cx';
import { STATEMENT } from './landingContent';
import { useSolarFrame } from './solarDayContext';
import styles from './landing.module.css';

const WORDS = STATEMENT.split(' ');

export default function MissionStatement() {
  const progress = useSolarFrame((state) => state.statement);
  const lit = Math.round(WORDS.length * progress);
  return (
    <p className={styles.statement}>
      <span className="sr-only">{STATEMENT}</span>
      <span aria-hidden="true">
        {WORDS.map((word, index) => (
          <span
            key={index}
            className={cx(index < lit && styles.wordOn, index === lit - 1 && lit < WORDS.length && styles.wordLead)}
          >
            {word}{' '}
          </span>
        ))}
      </span>
    </p>
  );
}
