import { useRouteError } from 'react-router';
import { Button } from '@/components/Button';
import styles from './ErrorPage.module.css';

export default function RouteError() {
  const error = useRouteError();
  const offline = error instanceof TypeError;
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className="h1">Something went wrong</h1>
        <p className="muted mt-8">
          {offline
            ? 'Part of the page couldn’t load. Check your connection and try again.'
            : 'Reload the page to try again.'}
        </p>
        <Button variant="primary" className="mt-24" onClick={() => location.reload()}>
          Reload
        </Button>
      </div>
    </main>
  );
}
