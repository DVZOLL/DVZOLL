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

/** R2-D2 beep — cheerful chirp for settings feedback */
export const playR2D2Beep = () => {
  const ctx = getCtx();
  const now = ctx.currentTime;

  const masterGain = ctx.createGain();
  masterGain.connect(ctx.destination);
  masterGain.gain.setValueAtTime(0.1, now);

  // Quick ascending chirps
  const freqs = [1200, 1600, 2000, 1400, 1800];
  const dur = 0.07;
  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    const t = now + i * (dur + 0.02);
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.linearRampToValueAtTime(freq * 1.1, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.08, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur);
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

/** Darth Vader breathing — cyclic inhale/exhale */
let vaderStopFn: (() => void) | null = null;

export const startVaderBreathing = () => {
  if (vaderStopFn) return; // already playing
  const ctx = getCtx();
  let stopped = false;

  const breathCycle = () => {
    if (stopped) return;
    const now = ctx.currentTime;

    // Inhale — filtered noise rising
    const inhaleLen = 0.8;
    const inhaleBuffer = ctx.createBuffer(1, ctx.sampleRate * inhaleLen, ctx.sampleRate);
    const inhaleData = inhaleBuffer.getChannelData(0);
    for (let i = 0; i < inhaleData.length; i++) {
      inhaleData[i] = (Math.random() * 2 - 1) * 0.08;
    }
    const inSrc = ctx.createBufferSource();
    inSrc.buffer = inhaleBuffer;
    const inFilter = ctx.createBiquadFilter();
    inFilter.type = "lowpass";
    inFilter.frequency.setValueAtTime(200, now);
    inFilter.frequency.linearRampToValueAtTime(600, now + inhaleLen);
    inFilter.Q.value = 1;
    const inGain = ctx.createGain();
    inGain.gain.setValueAtTime(0.001, now);
    inGain.gain.linearRampToValueAtTime(0.06, now + 0.3);
    inGain.gain.linearRampToValueAtTime(0.001, now + inhaleLen);
    inSrc.connect(inFilter);
    inFilter.connect(inGain);
    inGain.connect(ctx.destination);
    inSrc.start(now);
    inSrc.stop(now + inhaleLen);

    // Exhale — filtered noise falling
    const exhaleStart = now + 0.9;
    const exhaleLen = 0.9;
    const exhaleBuffer = ctx.createBuffer(1, ctx.sampleRate * exhaleLen, ctx.sampleRate);
    const exhaleData = exhaleBuffer.getChannelData(0);
    for (let i = 0; i < exhaleData.length; i++) {
      exhaleData[i] = (Math.random() * 2 - 1) * 0.08;
    }
    const exSrc = ctx.createBufferSource();
    exSrc.buffer = exhaleBuffer;
    const exFilter = ctx.createBiquadFilter();
    exFilter.type = "lowpass";
    exFilter.frequency.setValueAtTime(500, exhaleStart);
    exFilter.frequency.linearRampToValueAtTime(150, exhaleStart + exhaleLen);
    exFilter.Q.value = 1;
    const exGain = ctx.createGain();
    exGain.gain.setValueAtTime(0.001, exhaleStart);
    exGain.gain.linearRampToValueAtTime(0.05, exhaleStart + 0.2);
    exGain.gain.linearRampToValueAtTime(0.001, exhaleStart + exhaleLen);
    exSrc.connect(exFilter);
    exFilter.connect(exGain);
    exGain.connect(ctx.destination);
    exSrc.start(exhaleStart);
    exSrc.stop(exhaleStart + exhaleLen);

    // Schedule next cycle
    setTimeout(() => breathCycle(), 2000);
  };

  breathCycle();
  vaderStopFn = () => { stopped = true; vaderStopFn = null; };
};

export const stopVaderBreathing = () => {
  vaderStopFn?.();
};

/** Cantina Band — procedural Mos Eisley cantina music loop */
let cantinaStopFn: (() => void) | null = null;

export const startCantinaBand = () => {
  if (cantinaStopFn) return;
  const ctx = getCtx();
  let stopped = false;

  // Simple cantina melody notes (frequency, duration, gap)
  const melody: [number, number][] = [
    [587.33, 0.15], // D5
    [622.25, 0.15], // Eb5
    [587.33, 0.15], // D5
    [466.16, 0.3],  // Bb4
    [587.33, 0.15], // D5
    [622.25, 0.15], // Eb5
    [587.33, 0.15], // D5
    [466.16, 0.15], // Bb4
    [392.00, 0.15], // G4
    [392.00, 0.15], // G4
    [349.23, 0.3],  // F4
    [392.00, 0.15], // G4
    [349.23, 0.15], // F4
    [311.13, 0.3],  // Eb4
    [349.23, 0.15], // F4
    [311.13, 0.15], // Eb4
    [293.66, 0.45], // D4
  ];

  const playMelodyCycle = () => {
    if (stopped) return;
    const now = ctx.currentTime;
    let t = now;

    melody.forEach(([freq, dur]) => {
      if (stopped) return;
      const osc = ctx.createOscillator();
      osc.type = "square";
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.06, t);
      g.gain.setValueAtTime(0.06, t + dur - 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + dur);
      t += dur + 0.02;
    });

    // Bass line (simple oom-pah)
    for (let i = 0; i < 8; i++) {
      if (stopped) return;
      const bass = ctx.createOscillator();
      bass.type = "triangle";
      bass.frequency.value = i % 2 === 0 ? 146.83 : 196.00; // D3 / G3
      const bTime = now + i * 0.35;
      const bGain = ctx.createGain();
      bGain.gain.setValueAtTime(0.04, bTime);
      bGain.gain.exponentialRampToValueAtTime(0.001, bTime + 0.2);
      bass.connect(bGain);
      bGain.connect(ctx.destination);
      bass.start(bTime);
      bass.stop(bTime + 0.25);
    }

    const totalDur = melody.reduce((acc, [, d]) => acc + d + 0.02, 0);
    setTimeout(() => playMelodyCycle(), totalDur * 1000 + 200);
  };

  playMelodyCycle();
  cantinaStopFn = () => { stopped = true; cantinaStopFn = null; };
};

export const stopCantinaBand = () => {
  cantinaStopFn?.();
};

export const isCantinaBandPlaying = () => cantinaStopFn !== null;

export const useStarWarsSounds = () => ({
  playLightsaberIgnite: useCallback(playLightsaberIgnite, []),
  playBlasterShot: useCallback(playBlasterShot, []),
  playImperialMarch: useCallback(playImperialMarch, []),
  playHyperspaceJump: useCallback(playHyperspaceJump, []),
  playR2D2Beep: useCallback(playR2D2Beep, []),
  startVaderBreathing: useCallback(startVaderBreathing, []),
  stopVaderBreathing: useCallback(stopVaderBreathing, []),
  startCantinaBand: useCallback(startCantinaBand, []),
  stopCantinaBand: useCallback(stopCantinaBand, []),
});
