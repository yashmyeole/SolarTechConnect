import { useRef } from 'react';
import { Link } from 'react-router';
import Icon from '@/components/Icon';
import { cx } from '@/lib/cx';
import { usePageTitle } from '@/lib/usePageTitle';
import { LandingFooter, LandingHeader, SectionRail, SunClock } from './LandingChrome';
import { DOORS, FACT_SOURCES, FACTS, PARTNERS, ROADMAP, STEPS, TRAINING_CENTER } from './landingContent';
import MissionStatement from './MissionStatement';
import PathwayCard, { ShotTag } from './PathwayCard';
import { SolarDayContext } from './solarDayContext';
import { useSolarDay } from './useSolarDay';
import styles from './landing.module.css';

const VIDEOS = STEPS.map((step) => step.video);

const button = (...variants) => cx(styles.button, ...variants.map((variant) => styles[variant]));

function Sources({ items }) {
  return items.map((item, index) => (
    <span key={item.href}>
      {index > 0 && '; '}
      <a href={item.href}>{item.label}</a>, {item.note}
    </span>
  ));
}

function PrimaryActions() {
  return (
    <div className={styles.cta}>
      <Link className={button('light')} to="/jobs">
        Find solar work
        <Icon name="arrowRight" size={18} stroke={2} />
      </Link>
      <Link className={button('ghost')} to="/join/employer">
        Start hiring
      </Link>
    </div>
  );
}

export default function LandingPage() {
  usePageTitle(null);
  const root = useRef(null);
  const canvas = useRef(null);
  const hero = useRef(null);
  const mission = useRef(null);
  const who = useRef(null);
  const path = useRef(null);
  const partners = useRef(null);
  const finale = useRef(null);
  const footer = useRef(null);
  const { actions, glReady, noGl, motionOff, toggleMotion } = useSolarDay({
    root,
    canvas,
    hero,
    mission,
    who,
    path,
    partners,
    finale,
    footer,
    videos: VIDEOS,
  });

  return (
    <SolarDayContext value={actions}>
      <div ref={root} className={cx(styles.landing, noGl && styles.noGl, motionOff && styles.motionOff)}>
        <div className={styles.sky} aria-hidden="true" />
        <canvas ref={canvas} className={cx(styles.canvas, glReady && styles.canvasReady)} aria-hidden="true" />
        <LandingHeader />
        <SectionRail />
        <SunClock />

        <main className={styles.content}>
          <section ref={hero} className={cx(styles.scene, styles.hero)}>
            <div className={styles.scrim} />
            <div className={styles.heroInner}>
              <p className={styles.eyebrow}>The professional network for clean energy</p>
              <h1 className={styles.display}>Solar is built by people. Find yours here.</h1>
              <p className={styles.lede}>
                Solar Tech Connect brings trained technicians, verified employers and training partners into one
                network. No upfront cost.
              </p>
              <PrimaryActions />
            </div>
            <p className={styles.hint} aria-hidden="true">
              Scroll to follow the day <i />
            </p>
          </section>

          <section ref={mission} className={cx(styles.scene, styles.pin, styles.mission)} style={{ '--length': 2.5 }}>
            <div className={styles.stick}>
              <div className={styles.scrim} />
              <div className={styles.missionInner}>
                <p className={styles.eyebrow}>Why we exist</p>
                <MissionStatement />
              </div>
            </div>
          </section>

          <section ref={who} className={styles.sheet}>
            <div className={styles.wrap}>
              <header className={cx(styles.sectionHead, styles.reveal)} data-reveal>
                <p className={styles.eyebrow}>Who it’s for</p>
                <h2 className={styles.display}>Two ways in</h2>
                <p className={styles.lede}>
                  One account for the people who do the work. One for the companies that hire them.
                </p>
              </header>
              <div className={styles.doors}>
                {DOORS.map((door) => (
                  <article
                    key={door.kicker}
                    className={cx(styles.door, door.employer && styles.doorEmployer, styles.reveal)}
                    data-reveal
                  >
                    <p className={styles.kicker}>{door.kicker}</p>
                    <h3>{door.title}</h3>
                    <ul className={styles.ticks}>
                      {door.ticks.map((tick) => (
                        <li key={tick}>
                          <Icon name="check" size={20} stroke={2.2} />
                          {tick}
                        </li>
                      ))}
                    </ul>
                    <div className={styles.doorFooter}>
                      <Link className={button(door.action.variant)} to={door.action.to}>
                        {door.action.label}
                      </Link>
                      <span className={styles.fine}>{door.note}</span>
                    </div>
                  </article>
                ))}
              </div>
              <div className={styles.facts} aria-label="Why now">
                {FACTS.map(([figure, text, source]) => (
                  <div key={figure} className={cx(styles.fact, styles.reveal)} data-reveal>
                    <b>{figure}</b>
                    <p>{text}</p>
                    <small>{source}</small>
                  </div>
                ))}
              </div>
              <p className={styles.source}>
                Sources: <Sources items={FACT_SOURCES} />.
              </p>
            </div>
          </section>

          <section ref={path} className={cx(styles.scene, styles.pin, styles.pathway)} style={{ '--length': 4.6 }}>
            <div className={styles.stick}>
              <ShotTag />
              <div className={styles.pathUi}>
                <PathwayCard />
              </div>
            </div>
          </section>

          <section ref={partners} className={styles.sheet}>
            <div className={styles.wrap}>
              <header className={cx(styles.sectionHead, styles.reveal)} data-reveal>
                <p className={styles.eyebrow}>Partners</p>
                <h2 className={styles.display}>Built with the people who train and hire</h2>
                <p className={styles.lede}>
                  Training providers, developers and contractors use the network to prepare people and put them to work.
                </p>
              </header>
              <ul className={cx(styles.partners, styles.reveal)} aria-label="Partners" data-reveal>
                {PARTNERS.map((partner) => (
                  <li key={partner}>{partner}</li>
                ))}
              </ul>
              <div className={styles.duo}>
                <figure className={cx(styles.quote, styles.reveal)} data-reveal>
                  <blockquote>“It’s infrastructure for the clean-energy workforce.”</blockquote>
                  <figcaption>
                    <b>Steve Raeder</b>President and CEO, Summit Ridge Energy
                  </figcaption>
                </figure>
                <article className={cx(styles.center, styles.reveal)} data-reveal>
                  <p className={styles.kicker}>Training partner</p>
                  <h3>Training that starts in Chicago</h3>
                  <p>
                    JIREH Workforce Solutions opened its clean energy training center in the West Loop in April 2026, in
                    partnership with Summit Ridge Energy. Graduates leave with hands-on hours and safety training.
                  </p>
                  <dl>
                    {TRAINING_CENTER.stats.map(([figure, label]) => (
                      <div key={label}>
                        <dt>{figure}</dt>
                        <dd>{label}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className={styles.source}>
                    Source: <Sources items={[TRAINING_CENTER.source]} />.
                  </p>
                </article>
              </div>
              <div className={cx(styles.roadmapHead, styles.reveal)} data-reveal>
                <h3>On the roadmap</h3>
                <span className={styles.fine}>Planned, not live yet</span>
              </div>
              <ul className={styles.roadmap}>
                {ROADMAP.map(([title, text]) => (
                  <li key={title} className={styles.reveal} data-reveal>
                    <span className={styles.tag}>Planned</span>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section ref={finale} className={cx(styles.scene, styles.pin, styles.finale)} style={{ '--length': 2.3 }}>
            <div className={styles.stick}>
              <div className={styles.scrim} />
              <div className={styles.finaleInner}>
                <h2 className={styles.display}>
                  Empowering people.
                  <br />
                  Powering the planet.
                </h2>
                <p className={styles.lede}>Join the network. Creating a profile takes a few minutes.</p>
                <PrimaryActions />
                <p className={styles.signIn}>
                  Already a member? <Link to="/signin">Sign in</Link>
                </p>
              </div>
            </div>
          </section>
        </main>

        <LandingFooter ref={footer} motionOff={motionOff} onToggleMotion={toggleMotion} />
      </div>
    </SolarDayContext>
  );
}
