import { useEffect, useRef, useState } from "react";

/**
 * Detects rapid mouse shaking and applies a "Force push" effect
 * that scatters page elements briefly before reassembling.
 */
const SHAKE_THRESHOLD = 80; // px delta per sample
const SHAKE_COUNT_TRIGGER = 5; // direction changes needed
const SHAKE_WINDOW = 600; // ms window to detect shaking
const SCATTER_DURATION = 800; // ms elements stay scattered

const ForcePush = () => {
  const [scattered, setScattered] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const dirChanges = useRef<number[]>([]);
  const lastDir = useRef<number>(0);
  const cooldown = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cooldown.current || scattered) return;

      const dx = e.clientX - lastPos.current.x;
      lastPos.current = { x: e.clientX, y: e.clientY };

      if (Math.abs(dx) < SHAKE_THRESHOLD * 0.3) return;

      const dir = dx > 0 ? 1 : -1;
      if (dir !== lastDir.current && lastDir.current !== 0) {
        dirChanges.current.push(Date.now());
        // Prune old entries
        const now = Date.now();
        dirChanges.current = dirChanges.current.filter(t => now - t < SHAKE_WINDOW);

        if (dirChanges.current.length >= SHAKE_COUNT_TRIGGER) {
          triggerForcePush();
        }
      }
      lastDir.current = dir;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [scattered]);

  const triggerForcePush = () => {
    cooldown.current = true;
    dirChanges.current = [];
    setScattered(true);

    // Play a force push sound
    try {
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      // Whoosh + bass thud
      const gain = ctx.createGain();
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.4);
      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.5);

      // Noise burst
      const bufLen = ctx.sampleRate * 0.3;
      const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) d[i] = (Math.random() * 2 - 1) * 0.1;
      const noise = ctx.createBufferSource();
      noise.buffer = buf;
      const ng = ctx.createGain();
      ng.gain.setValueAtTime(0.12, now);
      ng.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      noise.connect(ng);
      ng.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.3);
    } catch {}

    setTimeout(() => {
      setScattered(false);
      setTimeout(() => { cooldown.current = false; }, 1000);
    }, SCATTER_DURATION);
  };

  useEffect(() => {
    if (!scattered) {
      document.documentElement.classList.remove("force-push-active");
      return;
    }
    document.documentElement.classList.add("force-push-active");
    return () => document.documentElement.classList.remove("force-push-active");
  }, [scattered]);

  return null;
};

export default ForcePush;
