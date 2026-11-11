import {
  AdditiveBlending,
  BackSide,
  BoxGeometry,
  BufferGeometry,
  ColorManagement,
  Float32BufferAttribute,
  InstancedBufferAttribute,
  InstancedMesh,
  LineSegments,
  LinearSRGBColorSpace,
  Matrix4,
  Mesh,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Vector2,
  Vector3,
  Vector4,
  VideoTexture,
  WebGLRenderTarget,
  WebGLRenderer,
} from 'three';
import { clamp, lerp } from './keyframes';
import {
  FINAL_FRAGMENT,
  GROUND_FRAGMENT,
  GROUND_VERTEX,
  LINK_FRAGMENT,
  LINK_VERTEX,
  NODE_FRAGMENT,
  NODE_VERTEX,
  POST_FRAGMENT,
  POST_VERTEX,
  SCREEN_VERTEX,
  SKY_FRAGMENT,
  SKY_VERTEX,
  TABLE_FRAGMENT,
  TABLE_VERTEX,
  VIDEO_FRAGMENT,
} from './shaders';

const LATITUDE = (40 * Math.PI) / 180;
const TILT = (25 * Math.PI) / 180;
const PITCH = 8;
const SLOPE = 4.4;
const TABLE = 6.6;
const GAP = 0.3;
const ROWS = 18;
const COLUMNS = 100;
const FIELD_START = -420;
const TABLE_HEIGHT = 1.63;
const FIELD_END = FIELD_START + COLUMNS * (TABLE + GAP);
const NODE_COUNT = 120;
const MAX_PIXELS = 3.2e6;

const hex = (value) => [1, 3, 5].map((index) => parseInt(value.slice(index, index + 2), 16) / 255);
const mix3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

// Sky colors by sun height. Columns: degrees, zenith, horizon, horizon near the sun at dawn and at dusk,
// sunlight, sun strength, ambient, stars, clouds.
const SKY_STOPS = [
  [-14, '#0b0912', '#1b1524', '#241b2d', '#241b2d', '#ffb38a', 0, 0.16, 1, 0.15],
  [-5, '#1f1930', '#584460', '#c9705f', '#b05a6e', '#ffb38a', 0, 0.3, 0.5, 0.5],
  [0, '#3a3552', '#9a7890', '#f39a72', '#e8796a', '#ffb890', 0.6, 0.5, 0.12, 0.8],
  [6, '#52648f', '#d8b9b2', '#ffd2ab', '#fbc09a', '#ffd9b0', 0.9, 0.66, 0, 1],
  [22, '#4f79b0', '#c6d9ea', '#e8eef3', '#e8eef3', '#fff2de', 1, 0.8, 0, 1],
  [50, '#3f74b8', '#cddff0', '#e4edf5', '#e4edf5', '#fffaf0', 1.05, 0.86, 0, 1],
].map((stop) => stop.map((value) => (typeof value === 'string' ? hex(value) : value)));

function skyAt(elevation, dusk) {
  let index = 0;
  while (index < SKY_STOPS.length - 2 && elevation > SKY_STOPS[index + 1][0]) index++;
  const a = SKY_STOPS[index];
  const b = SKY_STOPS[index + 1];
  const t = clamp((elevation - a[0]) / (b[0] - a[0]));
  return {
    zenith: mix3(a[1], b[1], t),
    horizon: mix3(a[2], b[2], t),
    horizonSun: mix3(mix3(a[3], a[4], dusk), mix3(b[3], b[4], dusk), t),
    sun: mix3(a[5], b[5], t),
    sunStrength: lerp(a[6], b[6], t),
    ambient: lerp(a[7], b[7], t),
    night: lerp(a[8], b[8], t),
    cloud: lerp(a[9], b[9], t),
  };
}

function seededRandom(seed) {
  let state = seed;
  return () => (state = (state * 16807) % 2147483647) / 2147483647;
}

export function createWorld(canvas, { videos = [], onLost }) {
  ColorManagement.enabled = false;
  const renderer = new WebGLRenderer({
    canvas,
    antialias: false,
    alpha: false,
    stencil: false,
    powerPreference: 'high-performance',
  });
  renderer.outputColorSpace = LinearSRGBColorSpace;
  renderer.setPixelRatio(1);

  const small = matchMedia('(max-width: 820px)').matches;
  let pixelRatio = Math.min(devicePixelRatio || 1, small ? 1.5 : 1.75);
  let samples = small ? 0 : 4;

  const scene = new Scene();
  const camera = new PerspectiveCamera(44, 1, 0.3, 6000);
  const vec3 = (x = 0, y = 0, z = 0) => new Vector3(x, y, z);
  const random = seededRandom(7);
  const disposables = [];
  const track = (...items) => {
    disposables.push(...items);
    return items[0];
  };

  const uniforms = {
    uTime: { value: 0 },
    uSun: { value: vec3(0, 1, 0) },
    uZen: { value: vec3() },
    uHor: { value: vec3() },
    uHorSun: { value: vec3() },
    uSunCol: { value: vec3() },
    uAmb: { value: vec3() },
    uGnd: { value: vec3() },
    uSunI: { value: 1 },
    uNight: { value: 0 },
    uCloud: { value: 1 },
    uFogK: { value: 0.0017 },
    uNet: { value: 0 },
  };
  const material = (options) => track(new ShaderMaterial(options));
  const geometry = (value) => track(value);

  const sky = new Mesh(
    geometry(new SphereGeometry(1, 48, 24)),
    material({
      uniforms,
      side: BackSide,
      depthWrite: false,
      vertexShader: SKY_VERTEX,
      fragmentShader: SKY_FRAGMENT,
    }),
  );
  sky.frustumCulled = false;
  sky.renderOrder = 10;
  scene.add(sky);

  const halfDepth = (SLOPE * Math.cos(TILT)) / 2;
  const lowEdge = TABLE_HEIGHT - (SLOPE * Math.sin(TILT)) / 2;
  const highEdge = TABLE_HEIGHT + (SLOPE * Math.sin(TILT)) / 2;
  const shadowRatio = Math.tan(LATITUDE);
  scene.add(
    new Mesh(
      geometry(new PlaneGeometry(5000, 5000).rotateX(-Math.PI / 2)),
      material({
        uniforms: {
          ...uniforms,
          uRows: { value: vec3(PITCH, -halfDepth - highEdge * shadowRatio, halfDepth - lowEdge * shadowRatio) },
          uField: { value: new Vector4(-ROWS * PITCH - 5, ROWS * PITCH + 2, FIELD_START, FIELD_END) },
        },
        vertexShader: GROUND_VERTEX,
        fragmentShader: GROUND_FRAGMENT,
      }),
    ),
  );

  const tableCount = (2 * ROWS + 1) * COLUMNS;
  const tableGeometry = geometry(new BoxGeometry(SLOPE, 0.07, TABLE));
  tableGeometry.setAttribute(
    'aRnd',
    new InstancedBufferAttribute(Float32Array.from({ length: tableCount }, random), 1),
  );
  const tables = new InstancedMesh(
    tableGeometry,
    material({
      uniforms: { ...uniforms, uPanelN: { value: vec3(Math.sin(TILT), Math.cos(TILT), 0) } },
      vertexShader: TABLE_VERTEX,
      fragmentShader: TABLE_FRAGMENT,
    }),
    tableCount,
  );
  const posts = new InstancedMesh(
    geometry(new BoxGeometry(0.14, 1.9, 0.14)),
    material({ uniforms, vertexShader: POST_VERTEX, fragmentShader: POST_FRAGMENT }),
    tableCount * 2,
  );
  const matrix = new Matrix4();
  const tilt = new Matrix4().makeRotationZ(-TILT);
  const panelPositions = [];
  let instance = 0;
  for (let row = -ROWS; row <= ROWS; row++) {
    for (let column = 0; column < COLUMNS; column++) {
      const x = row * PITCH;
      const z = FIELD_START + (column + 0.5) * (TABLE + GAP);
      matrix.copy(tilt).setPosition(x, TABLE_HEIGHT, z);
      tables.setMatrixAt(instance, matrix);
      matrix.makeTranslation(x - 0.6, 0.95, z - 2.2);
      posts.setMatrixAt(instance * 2, matrix);
      matrix.makeTranslation(x - 0.6, 0.95, z + 2.2);
      posts.setMatrixAt(instance * 2 + 1, matrix);
      panelPositions.push([x, TABLE_HEIGHT, z]);
      instance++;
    }
  }
  tables.frustumCulled = posts.frustumCulled = false;
  scene.add(tables, posts);

  const nodePositions = [];
  const nodeOrigins = [];
  const nodeDelays = [];
  const nodeKinds = [];
  for (let index = 0; index < NODE_COUNT; index++) {
    const x = (random() * 2 - 1) * 62;
    const z = -292 + random() * 330;
    const y = 5 + random() * 20 + Math.max(0, (z + 292) * 0.02);
    const panel = panelPositions[Math.floor(random() * panelPositions.length)];
    nodePositions.push([x, y, z]);
    nodeOrigins.push([x + (random() - 0.5) * 6, panel[1] + 0.4, z + (random() - 0.5) * 6]);
    nodeDelays.push(0.05 + random() * 0.5);
    nodeKinds.push(random() < 0.3 ? 1 : 0);
  }
  const networkUniforms = { ...uniforms, uScale: { value: 1000 } };
  const additive = { transparent: true, depthWrite: false, blending: AdditiveBlending };

  const nodeGeometry = geometry(new BufferGeometry());
  nodeGeometry.setAttribute('position', new Float32BufferAttribute(nodePositions.flat(), 3));
  nodeGeometry.setAttribute('aFrom', new Float32BufferAttribute(nodeOrigins.flat(), 3));
  nodeGeometry.setAttribute('aDelay', new Float32BufferAttribute(nodeDelays, 1));
  nodeGeometry.setAttribute('aKind', new Float32BufferAttribute(nodeKinds, 1));
  const nodes = new Points(
    nodeGeometry,
    material({ uniforms: networkUniforms, ...additive, vertexShader: NODE_VERTEX, fragmentShader: NODE_FRAGMENT }),
  );

  const link = { position: [], from: [], delay: [], t: [], edge: [], seed: [] };
  const seen = new Set();
  for (let index = 0; index < NODE_COUNT; index++) {
    const [x, y, z] = nodePositions[index];
    const nearest = nodePositions
      .map((other, otherIndex) => [otherIndex, Math.hypot(other[0] - x, (other[1] - y) * 2, other[2] - z)])
      .filter(([otherIndex]) => otherIndex !== index)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 3);
    for (const [other] of nearest) {
      const pair = index < other ? `${index}-${other}` : `${other}-${index}`;
      if (seen.has(pair)) continue;
      seen.add(pair);
      const edge = Math.max(nodeDelays[index], nodeDelays[other]) + 0.22 + random() * 0.12;
      const seed = random();
      for (const [end, t] of [
        [index, 0],
        [other, 1],
      ]) {
        link.position.push(...nodePositions[end]);
        link.from.push(...nodeOrigins[end]);
        link.delay.push(nodeDelays[end]);
        link.t.push(t);
        link.edge.push(edge);
        link.seed.push(seed);
      }
    }
  }
  const linkGeometry = geometry(new BufferGeometry());
  linkGeometry.setAttribute('position', new Float32BufferAttribute(link.position, 3));
  linkGeometry.setAttribute('aFrom', new Float32BufferAttribute(link.from, 3));
  linkGeometry.setAttribute('aDelay', new Float32BufferAttribute(link.delay, 1));
  linkGeometry.setAttribute('aT', new Float32BufferAttribute(link.t, 1));
  linkGeometry.setAttribute('aEdge', new Float32BufferAttribute(link.edge, 1));
  linkGeometry.setAttribute('aSeed', new Float32BufferAttribute(link.seed, 1));
  const links = new LineSegments(
    linkGeometry,
    material({ uniforms: networkUniforms, ...additive, vertexShader: LINK_VERTEX, fragmentShader: LINK_FRAGMENT }),
  );
  nodes.frustumCulled = links.frustumCulled = false;
  nodes.renderOrder = links.renderOrder = 20;
  scene.add(links, nodes);

  const screenCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quad = geometry(new PlaneGeometry(2, 2));
  const finalMaterial = material({
    uniforms: {
      tA: { value: null },
      tB: { value: null },
      uMix: { value: 0 },
      uTime: uniforms.uTime,
      uAspect: { value: 1 },
    },
    depthTest: false,
    depthWrite: false,
    vertexShader: SCREEN_VERTEX,
    fragmentShader: FINAL_FRAGMENT,
  });
  const finalScene = new Scene().add(new Mesh(quad, finalMaterial));
  const videoMaterial = material({
    uniforms: { tV: { value: null }, uFit: { value: new Vector2(1, 1) } },
    depthTest: false,
    depthWrite: false,
    vertexShader: SCREEN_VERTEX,
    fragmentShader: VIDEO_FRAGMENT,
  });
  const videoScene = new Scene().add(new Mesh(quad, videoMaterial));

  const footage = videos.map((source) => {
    if (!source) return null;
    const element = Object.assign(document.createElement('video'), {
      src: source,
      muted: true,
      loop: true,
      playsInline: true,
      preload: 'auto',
      crossOrigin: 'anonymous',
    });
    const clip = { element, texture: track(new VideoTexture(element)), ready: false };
    element.addEventListener('canplay', () => (clip.ready = true), { once: true });
    element.addEventListener('error', () => (clip.ready = false));
    return clip;
  });

  const target = vec3();
  const sun = vec3();
  let bufferWidth = 2;
  let bufferHeight = 2;
  let targetA = null;
  let targetB = null;

  function applyView(view, time, pointer, still) {
    const hour = (view.hour * Math.PI) / 180;
    const cosHour = Math.cos(hour);
    sun.set(cosHour * Math.sin(LATITUDE), cosHour * Math.cos(LATITUDE), Math.sin(hour)).normalize();
    const colors = skyAt((Math.asin(sun.y) * 180) / Math.PI, clamp(view.hour / 20 + 0.5));
    uniforms.uSun.value.copy(sun);
    uniforms.uZen.value.set(...colors.zenith);
    uniforms.uHor.value.set(...colors.horizon);
    uniforms.uHorSun.value.set(...colors.horizonSun);
    uniforms.uSunCol.value.set(...colors.sun);
    uniforms.uSunI.value = colors.sunStrength;
    uniforms.uNight.value = colors.night;
    uniforms.uCloud.value = colors.cloud;
    uniforms.uFogK.value = view.fog;
    uniforms.uNet.value = view.network;
    const ambient = mix3(colors.horizon, colors.zenith, 0.5).map((value) => value * colors.ambient);
    uniforms.uAmb.value.set(...ambient);
    const sunlight = colors.sunStrength * Math.pow(Math.max(sun.y, 0), 0.6);
    uniforms.uGnd.value.set(
      0.42 * (ambient[0] + colors.sun[0] * sunlight),
      0.42 * (ambient[1] + colors.sun[1] * sunlight),
      0.31 * (ambient[2] + colors.sun[2] * sunlight),
    );

    const drift = still ? 0 : view.drift;
    const portrait = camera.aspect < 1;
    camera.position.set(
      view.position[0] + Math.sin(time * 0.11) * drift + pointer.x * drift * 1.6,
      view.position[1] + Math.sin(time * 0.07 + 1) * drift * 0.4 - pointer.y * drift * 0.8,
      view.position[2] + Math.cos(time * 0.09) * drift,
    );
    camera.up.set(...view.up).normalize();
    camera.fov = portrait ? Math.min(74, view.fov * 1.3) : view.fov;
    camera.updateProjectionMatrix();
    camera.lookAt(target.set(...(portrait && view.portraitTarget ? view.portraitTarget : view.target)));
    sky.position.copy(camera.position);
    nodes.visible = links.visible = view.network > 0.002;
    networkUniforms.uScale.value = bufferHeight / (2 * Math.tan((camera.fov * Math.PI) / 360));
  }

  function resize() {
    const width = canvas.clientWidth || innerWidth;
    const height = canvas.clientHeight || innerHeight;
    const scale = Math.min(pixelRatio, Math.sqrt(MAX_PIXELS / (width * height)));
    const nextWidth = Math.max(2, Math.round(width * scale));
    const nextHeight = Math.max(2, Math.round(height * scale));
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    finalMaterial.uniforms.uAspect.value = width / height;
    if (targetA && nextWidth === bufferWidth && nextHeight === bufferHeight && targetA.samples === samples) return;
    bufferWidth = nextWidth;
    bufferHeight = nextHeight;
    renderer.setSize(bufferWidth, bufferHeight, false);
    targetA?.dispose();
    targetB?.dispose();
    targetA = new WebGLRenderTarget(bufferWidth, bufferHeight, { samples, depthBuffer: true });
    targetB = new WebGLRenderTarget(bufferWidth, bufferHeight, { samples, depthBuffer: true });
    finalMaterial.uniforms.tA.value = targetA.texture;
    finalMaterial.uniforms.tB.value = targetB.texture;
  }
  resize();

  function draw(view, renderTarget, time, pointer, still) {
    const clip = view.video >= 0 ? footage[view.video] : null;
    renderer.setRenderTarget(renderTarget);
    if (clip?.ready) {
      if (clip.element.paused) clip.element.play().catch(() => {});
      const videoAspect = clip.element.videoWidth / Math.max(1, clip.element.videoHeight);
      const screenAspect = bufferWidth / bufferHeight;
      videoMaterial.uniforms.tV.value = clip.texture;
      videoMaterial.uniforms.uFit.value.set(
        Math.min(1, screenAspect / videoAspect),
        Math.min(1, videoAspect / screenAspect),
      );
      renderer.render(videoScene, screenCamera);
    } else {
      applyView(view, time, pointer, still);
      renderer.render(scene, camera);
    }
  }

  let frameTime = 0;
  let frameCount = 0;
  let qualityDrops = 0;

  const onContextLost = (event) => {
    event.preventDefault();
    onLost();
  };
  canvas.addEventListener('webglcontextlost', onContextLost);

  return {
    render(frame, time, pointer, still, delta) {
      uniforms.uTime.value = time;
      const blend = frame.b ? frame.mix : 0;
      if (blend >= 0.999) draw(frame.b, targetA, time, pointer, still);
      else draw(frame.a, targetA, time, pointer, still);
      if (blend > 0.001 && blend < 0.999) draw(frame.b, targetB, time, pointer, still);
      finalMaterial.uniforms.uMix.value = blend > 0.001 && blend < 0.999 ? blend : 0;
      renderer.setRenderTarget(null);
      renderer.render(finalScene, screenCamera);

      if (qualityDrops < 2 && !still) {
        frameTime += delta;
        frameCount++;
        if (frameCount === 50) {
          if (frameTime / frameCount > 0.034 && (pixelRatio > 1 || samples > 0)) {
            pixelRatio = Math.max(1, pixelRatio * 0.72);
            samples = 0;
            qualityDrops++;
            resize();
          }
          frameTime = 0;
          frameCount = 0;
        }
      }
    },
    resize,
    dispose() {
      canvas.removeEventListener('webglcontextlost', onContextLost);
      footage.forEach((clip) => clip?.element.pause());
      disposables.forEach((item) => item.dispose());
      tables.dispose();
      posts.dispose();
      targetA?.dispose();
      targetB?.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
