import { Button } from '@/components/Button';
import Icon from '@/components/Icon';
import { DEMO_MODE } from '@/config';
import styles from '../auth.module.css';

export function StepActions({ first, onBack, nextLabel = 'Continue' }) {
  return (
    <div className={styles.actions}>
      <Button variant="quiet" onClick={onBack}>
        {first ? (
          'Change account type'
        ) : (
          <>
            <Icon name="chevronLeft" size={18} />
            Back
          </>
        )}
      </Button>
      <Button type="submit" variant="primary" size="lg">
        {nextLabel}
      </Button>
    </div>
  );
}

export function DemoFill({ onFill }) {
  if (!DEMO_MODE) return null;
  return (
    <Button variant="text" size="sm" onClick={onFill} className={styles.forgot}>
      <Icon name="flask" size={16} />
      Fill with demo details
    </Button>
  );
}
