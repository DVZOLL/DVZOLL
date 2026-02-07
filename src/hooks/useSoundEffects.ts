import { useCallback, useRef } from "react";

let audioCtx: AudioContext | null = null;

const getCtx = (): AudioContext => {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
};

/** Short rising chime — download success */
const playSuccess = () => {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const gain = ctx.createGain();
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

  [523.25, 659.25, 783.99].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    osc.connect(gain);
    osc.start(now + i * 0.1);
    osc.stop(now + 0.5 + i * 0.1);
  });
};

/** Soft click/pop — theme switch */
const playThemeSwitch = () => {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const gain = ctx.createGain();
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
  osc.frequency.exponentialRampToValueAtTime(660, now + 0.15);
  osc.connect(gain);
  osc.start(now);
  osc.stop(now + 0.15);
};

/** Glitchy digital noise — for konami / glitch */
const playGlitch = () => {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const bufferSize = ctx.sampleRate * 0.3;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.15;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 2000;
  filter.Q.value = 5;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(now);
  source.stop(now + 0.3);
};

/** Retro terminal boot beep */
const playTerminalBoot = () => {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const gain = ctx.createGain();
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

  const osc = ctx.createOscillator();
  osc.type = "square";
  osc.frequency.setValueAtTime(440, now);
  osc.frequency.setValueAtTime(880, now + 0.1);
  osc.frequency.setValueAtTime(440, now + 0.2);
  osc.connect(gain);
  osc.start(now);
  osc.stop(now + 0.35);
};

/** Playful two-tone — rickroll detect */
const playRickroll = () => {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const gain = ctx.createGain();
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

  const notes = [392, 440, 392, 329.63, 392, 440];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = freq;
    osc.connect(gain);
    osc.start(now + i * 0.12);
    osc.stop(now + 0.1 + i * 0.12);
  });
};

export const useSoundEffects = () => {
  return {
    playSuccess: useCallback(playSuccess, []),
    playThemeSwitch: useCallback(playThemeSwitch, []),
    playGlitch: useCallback(playGlitch, []),
    playTerminalBoot: useCallback(playTerminalBoot, []),
    playRickroll: useCallback(playRickroll, []),
  };
};

// Standalone exports for use outside React components
export { playSuccess, playThemeSwitch, playGlitch, playTerminalBoot, playRickroll };
