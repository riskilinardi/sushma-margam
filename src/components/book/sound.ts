// The lamp's sounds are synthesised with the Web Audio API rather than
// loaded from files, so there is nothing to download or license. Browsers
// only let audio start from a tap, which is why it all starts with the lamp.

const VOLUME = 0.8;

type Mixer = { context: AudioContext; output: GainNode; noise: AudioBuffer };
let mixer: Mixer | undefined;

function getMixer(): Mixer {
  if (mixer) return mixer;
  const context = new AudioContext();
  // A limiter on the way out, so overlapping sounds never clip.
  const limiter = context.createDynamicsCompressor();
  limiter.threshold.value = -6;
  limiter.ratio.value = 12;
  limiter.connect(context.destination);
  const output = context.createGain();
  output.gain.value = VOLUME;
  output.connect(limiter);

  const noise = context.createBuffer(
    1,
    context.sampleRate * 2,
    context.sampleRate,
  );
  const samples = noise.getChannelData(0);
  for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;

  mixer = { context, output, noise };
  return mixer;
}

export function setMuted(muted: boolean) {
  if (!mixer) return;
  mixer.output.gain.setTargetAtTime(
    muted ? 0 : VOLUME,
    mixer.context.currentTime,
    0.05,
  );
}

// Timed to the lamp: the match is struck, the centre wick catches, then the
// two side spouts (heard on the left and right), the flames settle into a
// low crackle, and a small bell rings as their light opens the book.
export function playLampLighting(bellAfter: number) {
  const m = getMixer();
  void m.context.resume();
  const t = m.context.currentTime + 0.03;

  strike(m, t);
  ignite(m, t + 0.08, 0, 0.5);
  ignite(m, t + 0.53, -0.55, 0.3);
  ignite(m, t + 0.58, 0.55, 0.3);
  burn(m, t + 0.2, 3);
  bell(m, t + bellAfter);
}

function strike(m: Mixer, at: number) {
  const shape = swell(m, at, 0.3, 0.004, 0.14);
  const scrape = filter(m, "bandpass", 3200, shape, 1.4);
  scrape.frequency.exponentialRampToValueAtTime(1600, at + 0.14);
  hiss(m, at, 0.2, scrape);
}

// A wick catching: a rush of air that opens up, with a low thump under it.
function ignite(m: Mixer, at: number, position: number, level: number) {
  const out = pan(m, position);

  const rush = filter(m, "lowpass", 300, swell(m, at, level, 0.05, 0.9, out));
  rush.frequency.setValueAtTime(300, at);
  rush.frequency.exponentialRampToValueAtTime(2200, at + 0.12);
  rush.frequency.exponentialRampToValueAtTime(600, at + 0.9);
  hiss(m, at, 1.1, rush);

  const thump = m.context.createOscillator();
  thump.frequency.setValueAtTime(120, at);
  thump.frequency.exponentialRampToValueAtTime(45, at + 0.2);
  thump.connect(swell(m, at, level * 0.6, 0.01, 0.25, out));
  thump.start(at);
  thump.stop(at + 0.3);
}

// The flames burning: a low breath of fire with sparse crackles that thin out.
function burn(m: Mixer, from: number, seconds: number) {
  const breath = m.context.createGain();
  breath.gain.setValueAtTime(0.0001, from);
  breath.gain.exponentialRampToValueAtTime(0.06, from + 0.5);
  breath.gain.exponentialRampToValueAtTime(0.0001, from + seconds);
  breath.connect(m.output);
  hiss(m, from, seconds, filter(m, "lowpass", 450, breath, 0.5));

  for (let at = from; at < from + seconds; at += 0.02 + Math.random() * 0.12) {
    const fading = 1 - (at - from) / seconds;
    const crack = swell(
      m,
      at,
      (0.05 + Math.random() * 0.2) * fading,
      0.001,
      0.015 + Math.random() * 0.02,
      pan(m, Math.random() * 1.2 - 0.6),
    );
    hiss(
      m,
      at,
      0.04,
      filter(m, "highpass", 1500 + Math.random() * 2500, crack),
    );
  }
}

// A small brass bell: a few inharmonic partials, the higher ones dying
// sooner, each paired with a slightly detuned twin for a slow shimmer.
const PARTIALS = [
  { ratio: 1, level: 1, ring: 3.2 },
  { ratio: 2, level: 0.55, ring: 2.2 },
  { ratio: 2.76, level: 0.4, ring: 1.6 },
  { ratio: 5.4, level: 0.2, ring: 0.9 },
];

function bell(m: Mixer, at: number, pitch = 880, level = 0.12) {
  for (const partial of PARTIALS) {
    for (const [detune, share] of [
      [0, 1],
      [1.3, 0.5],
    ]) {
      const tone = m.context.createOscillator();
      tone.frequency.value = pitch * partial.ratio + detune;
      tone.connect(
        swell(m, at, level * partial.level * share, 0.003, partial.ring),
      );
      tone.start(at);
      tone.stop(at + partial.ring + 0.1);
    }
  }
}

// A gain that rises to `peak` and dies away again.
function swell(
  m: Mixer,
  at: number,
  peak: number,
  attack: number,
  decay: number,
  to: AudioNode = m.output,
) {
  const gain = m.context.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(peak, at + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + attack + decay);
  gain.connect(to);
  return gain;
}

function hiss(m: Mixer, at: number, duration: number, to: AudioNode) {
  const source = m.context.createBufferSource();
  source.buffer = m.noise;
  source.connect(to);
  source.start(at, Math.random() * 0.8, duration);
}

function filter(
  m: Mixer,
  type: BiquadFilterType,
  frequency: number,
  to: AudioNode,
  q = 0.7,
) {
  const node = m.context.createBiquadFilter();
  node.type = type;
  node.frequency.value = frequency;
  node.Q.value = q;
  node.connect(to);
  return node;
}

function pan(m: Mixer, position: number) {
  const node = m.context.createStereoPanner();
  node.pan.value = position;
  node.connect(m.output);
  return node;
}
