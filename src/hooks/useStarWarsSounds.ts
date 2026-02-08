import { useCallback } from "react";

let audioCtx: AudioContext | null = null;
const getCtx = (): AudioContext => {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
};

/** Lightsaber ignition + sustained hum (download start) */
export const playLightsaberIgnite = () => {
  const ctx = getCtx();
  const now = ctx.currentTime;

  // Initial ignition "snap"
  const snapGain = ctx.createGain();
  snapGain.connect(ctx.destination);
  snapGain.gain.setValueAtTime(0.2, now);
  snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

  const snap = ctx.createOscillator();
  snap.type = "sawtooth";
  snap.frequency.setValueAtTime(120, now);
  snap.frequency.exponentialRampToValueAtTime(800, now + 0.08);
  snap.frequency.exponentialRampToValueAtTime(200, now + 0.15);
  snap.connect(snapGain);
  snap.start(now);
  snap.stop(now + 0.15);

  // Sustained hum
  const humGain = ctx.createGain();
  humGain.connect(ctx.destination);
  humGain.gain.setValueAtTime(0, now);
  humGain.gain.linearRampToValueAtTime(0.06, now + 0.15);
  humGain.gain.setValueAtTime(0.06, now + 0.8);
  humGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

  const hum1 = ctx.createOscillator();
  hum1.type = "sawtooth";
  hum1.frequency.value = 92;
  hum1.connect(humGain);
  hum1.start(now + 0.1);
  hum1.stop(now + 1.2);

  const hum2 = ctx.createOscillator();
  hum2.type = "sine";
  hum2.frequency.value = 184;
  const hum2Gain = ctx.createGain();
  hum2Gain.gain.value = 0.03;
  hum2.connect(hum2Gain);
  hum2Gain.connect(ctx.destination);
  hum2.start(now + 0.1);
  hum2.stop(now + 1.2);
};

/** Blaster shot (button click) */
export const playBlasterShot = () => {
  const ctx = getCtx();
  const now = ctx.currentTime;

  const gain = ctx.createGain();
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

  // White noise burst for the "pew" attack
  const bufferSize = ctx.sampleRate * 0.05;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.3;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.value = 3000;
  noiseFilter.Q.value = 3;
  noise.connect(noiseFilter);
  noiseFilter.connect(gain);
  noise.start(now);
  noise.stop(now + 0.05);

  // Descending tone for the "pew" tail
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(1800, now);
  osc.frequency.exponentialRampToValueAtTime(300, now + 0.18);
  const oscGain = ctx.createGain();
  oscGain.gain.setValueAtTime(0.12, now + 0.02);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
  osc.connect(oscGain);
  oscGain.connect(ctx.destination);
  osc.start(now + 0.02);
  osc.stop(now + 0.2);
};

/** Imperial March motif (error) */
export const playImperialMarch = () => {
  const ctx = getCtx();
  const now = ctx.currentTime;

  const gain = ctx.createGain();
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0.12, now);
  gain.gain.setValueAtTime(0.12, now + 1.6);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

  // G G G Eb-Bb G Eb-Bb G (simplified Imperial March opening)
  const notes: [number, number, number][] = [
    [392, 0, 0.3],    // G
    [392, 0.35, 0.3], // G
    [392, 0.7, 0.3],  // G
    [311.13, 1.05, 0.2], // Eb
    [466.16, 1.3, 0.1],  // Bb
    [392, 1.45, 0.3],    // G
    [311.13, 1.8, 0.2],  // Eb
    [466.16, 2.05, 0.1], // Bb
    [392, 2.2, 0.4],     // G
  ];

  notes.forEach(([freq, offset, dur]) => {
    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.value = freq;

    const noteGain = ctx.createGain();
    noteGain.gain.setValueAtTime(0.1, now + offset);
    noteGain.gain.setValueAtTime(0.1, now + offset + dur - 0.05);
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + offset + dur);

    osc.connect(noteGain);
    noteGain.connect(ctx.destination);
    osc.start(now + offset);
    osc.stop(now + offset + dur);
  });
};

/** Hyperspace whoosh */
export const playHyperspaceJump = () => {
  const ctx = getCtx();
  const now = ctx.currentTime;

  const gain = ctx.createGain();
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(80, now);
  osc.frequency.exponentialRampToValueAtTime(4000, now + 0.4);
  osc.frequency.exponentialRampToValueAtTime(60, now + 0.8);
  osc.connect(gain);
  osc.start(now);
  osc.stop(now + 0.8);

  // Noise sweep
  const bufferSize = ctx.sampleRate * 0.8;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.1;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.08, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
  noise.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(now);
  noise.stop(now + 0.8);
};

export const useStarWarsSounds = () => ({
  playLightsaberIgnite: useCallback(playLightsaberIgnite, []),
  playBlasterShot: useCallback(playBlasterShot, []),
  playImperialMarch: useCallback(playImperialMarch, []),
  playHyperspaceJump: useCallback(playHyperspaceJump, []),
});
