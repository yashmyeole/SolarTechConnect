import { cx } from '@/lib/cx';
import { STEPS } from './landingContent';
import { useSolarDayActions, useSolarFrame } from './solarDayContext';
import styles from './landing.module.css';

export function ShotTag() {
  const shot = useSolarFrame((state) => state.shot);
  return (
    <p className={styles.shotTag} aria-hidden="true">
      {shot + 1} / {STEPS.length}
    </p>
  );
}

export default function PathwayCard() {
  const { goToStep } = useSolarDayActions();
  const { shot, stepFill } = useSolarFrame((state) => ({ shot: state.shot, stepFill: state.stepFill }));
  return (
    <div className={styles.pathCard}>
      <p className={styles.eyebrow}>How it works</p>
      <h2>From classroom to rooftop</h2>
      <ol className={styles.steps}>
        {STEPS.map((step, index) => (
          <li key={step.title} className={cx(styles.step, index === shot && styles.stepOn)}>
            <span className={styles.stepNumber}>{index + 1}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </li>
        ))}
      </ol>
      <div className={styles.stepNav} role="group" aria-label="Go to step">
        {STEPS.map((step, index) => (
          <button
            key={step.title}
            type="button"
            style={{ '--fill': stepFill[index] }}
            aria-current={index === shot ? 'step' : undefined}
            onClick={() => goToStep(index)}
          >
            {step.short}
          </button>
        ))}
      </div>
    </div>
  );
}
