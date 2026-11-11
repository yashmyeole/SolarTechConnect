export const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
export const smooth = (t) => t * t * (3 - 2 * t);
export const lerp = (a, b, t) => a + (b - a) * t;
const lerpArray = (a, b, t) => a.map((value, index) => lerp(value, b[index], t));

// World units are meters. Rows of panels run east to west: -Z is east, +X is south.
// H is the sun's hour angle in degrees: -90 sunrise, 0 solar noon, +90 sunset (equinox, 40° north).
const key = (position, target, fov, hour, options = {}) => ({
  position,
  target,
  fov,
  hour,
  portraitTarget: options.portraitTarget ?? null,
  up: options.up ?? [0, 1, 0],
  fog: options.fog ?? 0.0017,
  network: options.network ?? 0,
  drift: options.drift ?? 0.25,
  video: options.video ?? -1,
});

const HERO_START = key([0.9, 4.0, 70], [-57, 3.1, -260], 44, -84, { portraitTarget: [-20, 3.1, -260] });
const HERO_END = key([0.9, 6.4, 58], [-57, 4.4, -260], 44, -79, { portraitTarget: [-20, 4.4, -260] });
const MISSION_END = key([14, 62, 110], [-22, 11.8, -15.6], 44, -58, {
  fog: 0.0007,
  drift: 1.2,
  portraitTarget: [-4.2, 11.8, -19.4],
});
const SHOTS = [
  [
    key([3.3, 1.7, -34], [-5, 1.9, -70], 40, -26, { drift: 0.05, video: 0 }),
    key([3.3, 1.7, -42], [-5, 1.9, -78], 40, -22, { drift: 0.05, video: 0 }),
  ],
  [
    key([3.5, 2.8, -116.6], [-0.7, 1.45, -121.5], 30, -7, { drift: 0.02, video: 1 }),
    key([3.1, 3.0, -118.6], [-0.7, 1.45, -122.6], 30, -3, { drift: 0.02, video: 1 }),
  ],
  [
    key([0, 150, -120], [-40, 0, -79], 36, 10, { up: [-0.5, 0, -0.87], fog: 0.0003, drift: 0.7, video: 2 }),
    key([8, 150, -146], [-32, 0, -105], 36, 14, { up: [-0.42, 0, -0.9], fog: 0.0003, drift: 0.7, video: 2 }),
  ],
  [
    key([0, 60, -330], [72.5, 44.3, -39.3], 46, 72, {
      fog: 0.00035,
      drift: 0.8,
      video: 3,
      portraitTarget: [112, 44.3, -52],
    }),
    key([-6, 66, -350], [66.5, 50.3, -59.3], 46, 76, {
      fog: 0.00035,
      drift: 0.8,
      video: 3,
      portraitTarget: [106, 50.3, -72],
    }),
  ],
];
const FINALE_START = key([0.9, 4.2, -300], [0.4, 4.6, 200], 44, 85);
const FINALE_END = key([2, 15, -322], [0, 20, 200], 46, 100, { network: 1, fog: 0.0012, drift: 0.5 });

export const SHOT_COUNT = SHOTS.length;

function lerpKey(a, b, t) {
  return {
    position: lerpArray(a.position, b.position, t),
    target: lerpArray(a.target, b.target, t),
    portraitTarget:
      a.portraitTarget || b.portraitTarget
        ? lerpArray(a.portraitTarget || a.target, b.portraitTarget || b.target, t)
        : null,
    up: lerpArray(a.up, b.up, t),
    fov: lerp(a.fov, b.fov, t),
    hour: lerp(a.hour, b.hour, t),
    fog: lerp(a.fog, b.fog, t),
    network: lerp(a.network, b.network, t),
    drift: lerp(a.drift, b.drift, t),
    video: t < 0.5 ? a.video : b.video,
  };
}

const shotAt = (index, t) => lerpKey(SHOTS[index][0], SHOTS[index][1], clamp(t));

function pathway(progress) {
  const count = SHOTS.length;
  const blend = 0.17;
  const segment = clamp(progress) * count;
  const index = Math.min(count - 1, Math.floor(segment));
  const local = segment - index;
  if (local > 1 - blend && index < count - 1) {
    const mix = (local - (1 - blend)) / (2 * blend);
    return { a: shotAt(index, local), b: shotAt(index + 1, 0), mix: smooth(mix), segment };
  }
  if (local < blend && index > 0) {
    const mix = 0.5 + local / (2 * blend);
    return { a: shotAt(index - 1, 1), b: shotAt(index, local), mix: smooth(mix), segment };
  }
  return { a: shotAt(index, local), b: null, mix: 0, segment };
}

export function timeline(y, layout, intro) {
  const { hero, mission, who, path, partners, finale, viewport } = layout;
  const out = { a: HERO_START, b: null, mix: 0, segment: 0, missionProgress: 0, covered: false };
  const span = (section) => Math.max(1, section.height - viewport);
  const heroStart = { ...HERO_START, hour: lerp(-96, -84, 1 - Math.pow(1 - intro, 3)) };

  if (y < mission.top) {
    out.a = lerpKey(heroStart, HERO_END, smooth(clamp(y / Math.max(1, hero.height))));
    return out;
  }
  if (y < mission.top + span(mission)) {
    out.missionProgress = (y - mission.top) / span(mission);
    out.a = lerpKey(HERO_END, MISSION_END, smooth(out.missionProgress));
    return out;
  }
  out.missionProgress = 1;

  const cutUnder = (sheet, before, after) => {
    const start = sheet.top;
    const end = Math.max(start + 1, sheet.top + sheet.height - viewport);
    out.covered = y > start + 40 && y < end - 40;
    out.a = y < (start + end) / 2 ? before : after;
  };
  const firstShot = shotAt(0, 0);
  const lastShot = shotAt(SHOTS.length - 1, 1);

  if (y < path.top - viewport) {
    cutUnder(who, MISSION_END, firstShot);
    return out;
  }
  if (y < path.top) {
    out.a = firstShot;
    return out;
  }
  if (y < path.top + span(path)) return { ...out, ...pathway((y - path.top) / span(path)) };

  out.segment = SHOTS.length;
  if (y < finale.top - viewport) {
    cutUnder(partners, lastShot, FINALE_START);
    return out;
  }
  if (y < finale.top) {
    out.a = FINALE_START;
    return out;
  }
  out.a = lerpKey(FINALE_START, FINALE_END, smooth(clamp((y - finale.top) / span(finale))));
  return out;
}
