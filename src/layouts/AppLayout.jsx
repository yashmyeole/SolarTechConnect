import { Link, Outlet, useLocation } from 'react-router';
import Avatar from '@/components/Avatar';
import { Button, ButtonLink } from '@/components/Button';
import Icon from '@/components/Icon';
import Logo, { LogoMark } from '@/components/Logo';
import { Menu } from '@/components/Menu';
import { DEMO_MODE, SEARCH_SHORTCUT } from '@/config';
import DemoMenuItems from '@/features/demo/DemoMenuItems';
import { useSectionFocus } from '@/lib/useSectionFocus';
import { homePath, usePersona, useRole } from '@/store';
import { useUiStore } from '@/store/ui';
import AccountMenu from './AccountMenu';
import { APP_NAV, BOTTOM_NAV, isActive, useNavCounts } from './navigation';
import NavItem from './NavItem';
import styles from './AppLayout.module.css';

const FOOT_NAV = [
  { to: '/settings', label: 'Settings', icon: 'sliders' },
  { to: '/help', label: 'Help', icon: 'help' },
];

function SideNav({ role }) {
  const { pathname } = useLocation();
  const counts = useNavCounts();
  const persona = usePersona();
  const openSearch = useUiStore((state) => state.openSearch);

  return (
    <aside className={styles.side}>
      <Logo to={homePath(role)} className={styles.logo} />
      <button type="button" className={styles.search} onClick={openSearch} title={`Search (${SEARCH_SHORTCUT})`}>
        <Icon name="search" size={18} />
        <span className={styles.label}>Search</span>
        <kbd className={styles.label}>{SEARCH_SHORTCUT}</kbd>
      </button>
      {role === 'emp' && (
        <ButtonLink variant="primary" to="/employer/jobs/new" className={styles.cta} title="Post a job">
          <Icon name="plus" size={18} />
          <span className={styles.label}>Post a job</span>
        </ButtonLink>
      )}
      <nav className={styles.nav} aria-label="Main">
        {APP_NAV[role].map((entry) => (
          <NavItem key={entry.to} entry={entry} active={isActive(pathname, entry)} count={counts[entry.count]} />
        ))}
      </nav>
      <div className={styles.foot}>
        <nav className={styles.nav} aria-label="Account">
          {FOOT_NAV.map((entry) => (
            <NavItem key={entry.to} entry={entry} active={isActive(pathname, entry)} />
          ))}
          {DEMO_MODE && (
            <Menu
              label="Demo"
              placement="top-start"
              trigger={(props) => (
                <button type="button" className={styles.navItem} title="Demo" {...props}>
                  <Icon name="flask" />
                  <span className={styles.label}>Demo</span>
                </button>
              )}
            >
              <DemoMenuItems />
            </Menu>
          )}
        </nav>
        <Menu
          label="Account"
          placement="top-start"
          wide
          trigger={(props) => (
            <button type="button" className={styles.account} title={persona.name} {...props}>
              <Avatar name={persona.name} size={36} />
              <span className={`${styles.label} grow`}>
                <span className={styles.accountName}>{persona.name}</span>
                <span className={styles.accountSub}>
                  {role === 'emp' ? persona.headline.replace(/^.* at /, '') : 'View profile and account'}
                </span>
              </span>
              <Icon name="more" size={18} className={`${styles.label} subtle`} />
            </button>
          )}
        >
          <AccountMenu role={role} />
        </Menu>
      </div>
    </aside>
  );
}

function MobileBar({ role }) {
  const { notifications } = useNavCounts();
  const openSearch = useUiStore((state) => state.openSearch);
  return (
    <header className={styles.mobileBar}>
      <Link to={homePath(role)} aria-label="Solar Tech Connect home">
        <LogoMark size={28} />
      </Link>
      <p className={styles.mobileTitle}>Solar Tech Connect</p>
      <Button iconOnly aria-label="Search" onClick={openSearch}>
        <Icon name="search" size={22} />
      </Button>
      <ButtonLink
        iconOnly
        to="/notifications"
        className={styles.bell}
        aria-label={`Notifications${notifications ? `, ${notifications} new` : ''}`}
      >
        <Icon name="bell" size={22} />
        {notifications > 0 && <span className={styles.count}>{notifications}</span>}
      </ButtonLink>
    </header>
  );
}

function BottomNav({ role }) {
  const { pathname } = useLocation();
  const counts = useNavCounts();
  const persona = usePersona();
  const inMenu = !BOTTOM_NAV[role].some((entry) => isActive(pathname, entry));
  return (
    <nav className={styles.bottomNav} aria-label="Main">
      {BOTTOM_NAV[role].map((entry) => (
        <Link key={entry.to} to={entry.to} aria-current={isActive(pathname, entry) ? 'page' : undefined}>
          <Icon name={entry.icon} size={23} />
          {counts[entry.count] > 0 && <span className={styles.count}>{counts[entry.count]}</span>}
          {entry.label}
        </Link>
      ))}
      <Menu
        label="You"
        sheet
        trigger={(props) => (
          <button type="button" aria-current={inMenu ? 'page' : undefined} {...props}>
            <Avatar name={persona.name} size={24} />
            You
          </button>
        )}
      >
        <AccountMenu role={role} mobile />
      </Menu>
    </nav>
  );
}

export default function AppLayout() {
  const role = useRole();
  const mainRef = useSectionFocus();
  return (
    <div className={styles.shell}>
      <SideNav role={role} />
      <div className={styles.column}>
        <MobileBar role={role} />
        <main ref={mainRef} tabIndex={-1} className={styles.content}>
          <Outlet />
        </main>
      </div>
      <BottomNav role={role} />
    </div>
  );
}
