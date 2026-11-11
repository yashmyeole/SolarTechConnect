import { useEffect, useRef, useState } from 'react';
import { createStore } from 'zustand/vanilla';
import { createSolarDay } from './scene/solarDay';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

const FIRST_FRAME = {
  solidHeader: false,
  rail: 0,
  railOnLight: false,
  clockHidden: true,
  clock: '6:24 am',
  phase: 'First light',
  statement: 0,
  shot: 0,
  stepFill: [0, 0, 0, 0],
};

export function useSolarDay({ root, canvas, hero, mission, who, path, partners, finale, footer, videos }) {
  const [frame] = useState(() => createStore(() => FIRST_FRAME));
  const [glReady, setGlReady] = useState(false);
  const [noGl, setNoGl] = useState(false);
  const [motionOff, setMotionOff] = useState(() => matchMedia(REDUCED_MOTION).matches);
  const engine = useRef(null);
  const [actions] = useState(() => ({
    frame,
    goTo: (name) => engine.current?.goTo(name),
    goToStep: (index) => engine.current?.goToStep(index),
  }));

  useEffect(() => {
    const day = createSolarDay({
      root: root.current,
      canvas: canvas.current,
      sections: {
        hero: hero.current,
        mission: mission.current,
        who: who.current,
        path: path.current,
        partners: partners.current,
        finale: finale.current,
        footer: footer.current,
      },
      videos,
      motionOff: matchMedia(REDUCED_MOTION).matches,
      onFrame: (state) => frame.setState(state),
      onReady: () => setGlReady(true),
      onUnavailable: () => setNoGl(true),
    });
    engine.current = day;
    return () => {
      day.destroy();
      engine.current = null;
    };
  }, [frame, root, canvas, hero, mission, who, path, partners, finale, footer, videos]);

  useEffect(() => {
    engine.current?.setMotion(motionOff);
  }, [motionOff]);

  useEffect(() => {
    const query = matchMedia(REDUCED_MOTION);
    const onChange = (event) => setMotionOff(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const items = root.current.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.dataset.revealed = '';
          observer.unobserve(entry.target);
        }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [root]);

  return {
    actions,
    glReady,
    noGl,
    motionOff,
    toggleMotion: () => setMotionOff((off) => !off),
  };
}
