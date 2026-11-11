import { Link } from 'react-router';
import { LogoMark } from '@/components/Logo';
import { LEGAL, SUPPORT } from '@/data/options';
import { cx } from '@/lib/cx';
import { FOOTER_COLUMNS, RAIL_LINKS } from './landingContent';
import { useSolarDayActions, useSolarFrame } from './solarDayContext';
import styles from './landing.module.css';

function SectionLink({ section, className, children, ...props }) {
  const { goTo } = useSolarDayActions();
  return (
    <a
      href={`#${section}`}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        goTo(section);
      }}
      {...props}
    >
      {children}
    </a>
  );
}

function Brand() {
  return (
    <SectionLink section="top" className={styles.brand} aria-label="Solar Tech Connect, back to top">
      <LogoMark />
      <span>Solar Tech Connect</span>
    </SectionLink>
  );
}

export function LandingHeader() {
  const solid = useSolarFrame((state) => state.solidHeader);
  return (
    <header className={cx(styles.header, solid && styles.headerSolid)}>
      <Brand />
      <nav className={styles.headerNav} aria-label="Main">
        <Link to="/jobs">Find jobs</Link>
        <Link to="/companies">Companies</Link>
        <Link to="/community">Events and courses</Link>
      </nav>
      <div className={styles.headerActions}>
        <Link className={cx(styles.headerLink, styles.headerEmployers)} to="/join/employer">
          For employers
        </Link>
        <Link className={styles.headerLink} to="/signin">
          Sign in
        </Link>
        <Link className={cx(styles.button, styles.small, styles.light)} to="/join">
          Join free
        </Link>
      </div>
    </header>
  );
}

export function SectionRail() {
  const { rail, railOnLight } = useSolarFrame((state) => ({ rail: state.rail, railOnLight: state.railOnLight }));
  return (
    <nav className={cx(styles.rail, railOnLight && styles.railOnLight)} aria-label="Sections">
      {RAIL_LINKS.map(([section, label], index) => (
        <SectionLink key={section} section={section} aria-current={index === rail}>
          <span>{label}</span>
        </SectionLink>
      ))}
    </nav>
  );
}

export function SunClock() {
  const { clockHidden, clock, phase } = useSolarFrame((state) => ({
    clockHidden: state.clockHidden,
    clock: state.clock,
    phase: state.phase,
  }));
  return (
    <div className={cx(styles.clock, clockHidden && styles.clockHidden)} aria-hidden="true">
      <i />
      <b>{clock}</b>
      <em>{phase}</em>
    </div>
  );
}

export function LandingFooter({ ref, motionOff, onToggleMotion }) {
  return (
    <footer ref={ref} className={styles.footer}>
      <div className={styles.wrap}>
        <div className={styles.footerGrid}>
          <div>
            <Brand />
            <p className={styles.tagline}>The professional network for clean energy.</p>
          </div>
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h3>{column.title}</h3>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link to={link.to}>{link.label}</Link>
                    ) : (
                      <SectionLink section={link.section}>{link.label}</SectionLink>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3>Contact</h3>
            <ul>
              <li>
                <a href={`mailto:${SUPPORT.email}`}>{SUPPORT.email}</a>
              </li>
              <li>
                <a href={`tel:${SUPPORT.tel}`}>{SUPPORT.phone}</a>
              </li>
              <li>
                <Link to="/help">Help</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.legal}>
          <span>© {new Date().getFullYear()} Solar Tech Connect</span>
          <a href={LEGAL.privacy}>Privacy</a>
          <a href={LEGAL.terms}>Terms</a>
          <button type="button" className={styles.motion} onClick={onToggleMotion}>
            {motionOff ? 'Play background motion' : 'Pause background motion'}
          </button>
        </div>
      </div>
    </footer>
  );
}
