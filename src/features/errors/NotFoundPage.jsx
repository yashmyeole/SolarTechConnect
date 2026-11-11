import { ButtonLink } from '@/components/Button';
import { Card } from '@/components/Card';
import { usePageTitle } from '@/lib/usePageTitle';
import { homePath, useRole } from '@/store';
import styles from './ErrorPage.module.css';

export default function NotFoundPage() {
  const role = useRole();
  usePageTitle('Page not found');
  return (
    <Card padded className={styles.card}>
      <h1 className="h1">We couldn’t find that page</h1>
      <p className="muted mt-8">The link may be old, or the page may have moved.</p>
      <ButtonLink variant="primary" className="mt-24" to={homePath(role)}>
        Go to {role ? 'your home page' : 'the home page'}
      </ButtonLink>
    </Card>
  );
}
