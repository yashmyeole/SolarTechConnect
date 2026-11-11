import { clamp, SHOT_COUNT, timeline } from './keyframes';

const SCENES = ['hero', 'mission', 'path', 'finale'];
const RAIL = ['hero', 'mission', 'who', 'path', 'partners', 'finale'];

function clockTime(hour) {
  const minutes = Math.round((12 + hour / 15) * 60);
  const hours = Math.floor(minutes / 60);
  const suffix = hours >= 12 ? 'pm' : 'am';
  return `${hours % 12 || 12}:${String(minutes % 60).padStart(2, '0')} ${suffix}`;
}

function dayPhase(hour) {
  if (hour < -90) return 'Before sunrise';
  if (hour < -75) return 'First light';
  if (hour < -30) return 'Morning';
  if (hour < 30) return 'Midday';
  if (hour < 68) return 'Afternoon';
  if (hour < 90) return 'Golden hour';
  return 'Nightfall';
}

const round = (value) => Math.round(value * 1000) / 1000;

export function createSolarDay({
  root,
  sections,
  canvas,
  videos,
  motionOff: startStill,
  onFrame,
  onReady,
  onUnavailable,
}) {
  const layout = { viewport: innerHeight };
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let still = startStill;
  let intro = still ? 1 : 0;
  let world = null;
  let rendered = false;
  let disposed = false;
  let smoothY = null;
  let time = 0;
  let last = performance.now();
  let dirty = true;
  let frameId = 0;

  function measure() {
    layout.viewport = innerHeight;
    for (const [name, element] of Object.entries(sections)) {
      const rect = element.getBoundingClientRect();
      layout[name] = { top: rect.top + scrollY, height: rect.height };
    }
    dirty = true;
  }

  function describe(frame, y) {
    const center = y + layout.viewport / 2;
    const rail = RAIL.reduce((current, name, index) => (center >= layout[name].top ? index : current), 0);
    const inScene = SCENES.some(
      (name) => center >= layout[name].top && center < layout[name].top + layout[name].height,
    );
    const view = frame.b && frame.mix > 0.5 ? frame.b : frame.a;
    return {
      solidHeader: scrollY > 24,
      rail,
      railOnLight: !inScene,
      clockHidden: !inScene || frame.covered || layout.footer.top < y + layout.viewport - 40,
      clock: clockTime(view.hour),
      phase: dayPhase(view.hour),
      statement: round(clamp((frame.missionProgress - 0.05) / 0.6)),
      shot: Math.min(SHOT_COUNT - 1, Math.floor(frame.segment)),
      stepFill: Array.from({ length: SHOT_COUNT }, (_, index) => round(clamp(frame.segment - index))),
    };
  }

  function tick(now) {
    frameId = requestAnimationFrame(tick);
    const delta = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (document.hidden) return;

    const target = scrollY;
    const previous = smoothY ?? target;
    smoothY =
      still || Math.abs(target - previous) < 0.3 ? target : previous + (target - previous) * (1 - Math.exp(-delta * 9));
    if (!still) {
      time += delta;
      const ease = 1 - Math.exp(-delta * 3);
      pointer.x += (pointer.targetX - pointer.x) * ease;
      pointer.y += (pointer.targetY - pointer.y) * ease;
      if (rendered && intro < 1) intro = Math.min(1, intro + delta / 2.8);
    }
    if (still && smoothY === previous && !dirty) return;

    const frame = timeline(smoothY, layout, intro);
    onFrame(describe(frame, smoothY));
    if (world && !frame.covered) {
      world.render(frame, time, still ? { x: 0, y: 0 } : pointer, still, delta);
      if (!rendered) {
        rendered = true;
        onReady();
      }
    }
    dirty = false;
  }

  const unavailable = () => {
    world = null;
    onUnavailable();
    measure();
  };

  const onResize = () => {
    measure();
    world?.resize();
  };
  const onPointerMove = (event) => {
    pointer.targetX = (event.clientX / innerWidth) * 2 - 1;
    pointer.targetY = (event.clientY / innerHeight) * 2 - 1;
  };
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const resizeObserver = new ResizeObserver(measure);

  addEventListener('resize', onResize);
  if (finePointer) addEventListener('pointermove', onPointerMove, { passive: true });
  resizeObserver.observe(root);
  document.fonts.ready.then(() => !disposed && measure());
  measure();
  frameId = requestAnimationFrame(tick);

  if (document.createElement('canvas').getContext('webgl2')) {
    import('./world')
      .then(({ createWorld }) => {
        if (disposed) return;
        try {
          world = createWorld(canvas, { videos, onLost: unavailable });
        } catch {
          unavailable();
        }
      })
      .catch(unavailable);
  } else {
    unavailable();
  }

  const span = (section) => Math.max(0, section.height - layout.viewport);
  const scrollToY = (top) => scrollTo({ top, behavior: still ? 'auto' : 'smooth' });

  return {
    goTo(name) {
      measure();
      const { mission, who, path, partners, finale } = layout;
      const positions = {
        top: 0,
        mission: mission.top + span(mission) * 0.62,
        who: who.top,
        pathway: path.top + span(path) * 0.1,
        partners: partners.top,
        join: finale.top + span(finale) * 0.92,
      };
      scrollToY(positions[name] ?? 0);
    },
    goToStep(index) {
      scrollToY(layout.path.top + (span(layout.path) * (index + 0.5)) / SHOT_COUNT);
    },
    setMotion(off) {
      still = off;
      if (off) intro = 1;
      dirty = true;
    },
    destroy() {
      disposed = true;
      cancelAnimationFrame(frameId);
      removeEventListener('resize', onResize);
      removeEventListener('pointermove', onPointerMove);
      resizeObserver.disconnect();
      world?.dispose();
      world = null;
    },
  };
}
