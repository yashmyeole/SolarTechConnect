import { Link, Outlet, useLocation } from 'react-router';
import { ButtonLink } from '@/components/Button';
import Logo from '@/components/Logo';
import { useSectionFocus } from '@/lib/useSectionFocus';
import { isActive, PUBLIC_NAV } from './navigation';
import styles from './SiteLayout.module.css';

export default function SiteLayout() {
  const { pathname } = useLocation();
  const mainRef = useSectionFocus();
  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <Logo to="/" className={styles.logo} />
          <nav className={styles.nav} aria-label="Main">
            {PUBLIC_NAV.map((entry) => (
              <Link key={entry.to} to={entry.to} aria-current={isActive(pathname, entry) ? 'page' : undefined}>
                {entry.label}
              </Link>
            ))}
          </nav>
          <span className="grow" />
          <Link className={styles.employers} to="/join/employer">
            For employers
          </Link>
          <ButtonLink size="sm" to="/signin">
            Sign in
          </ButtonLink>
          <ButtonLink size="sm" variant="primary" to="/join">
            Join free
          </ButtonLink>
        </div>
      </header>
      <main ref={mainRef} tabIndex={-1} className={styles.page}>
        <Outlet />
      </main>
    </>
  );
}
