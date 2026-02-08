import { useEffect, useRef } from "react";

const TRAIL_LENGTH = 12;
const FADE_SPEED = 0.92;

interface TrailPoint {
  x: number;
  y: number;
  opacity: number;
}

const LightsaberCursor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<TrailPoint[]>([]);
  const mouseRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      trailRef.current.unshift({ x: e.clientX, y: e.clientY, opacity: 1 });
      if (trailRef.current.length > TRAIL_LENGTH) {
        trailRef.current.pop();
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Read the primary color from CSS
    const getPrimaryColor = () => {
      const style = getComputedStyle(document.documentElement);
      const primary = style.getPropertyValue("--primary").trim();
      return primary || "152 100% 50%";
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const primary = getPrimaryColor();

      const trail = trailRef.current;
      
      // Draw trail segments
      for (let i = 0; i < trail.length - 1; i++) {
        const p = trail[i];
        const pNext = trail[i + 1];
        
        p.opacity *= FADE_SPEED;

        if (p.opacity < 0.01) continue;

        const width = (1 - i / trail.length) * 3;

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(pNext.x, pNext.y);
        ctx.strokeStyle = `hsla(${primary} / ${p.opacity * 0.6})`;
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.stroke();

        // Glow layer
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(pNext.x, pNext.y);
        ctx.strokeStyle = `hsla(${primary} / ${p.opacity * 0.15})`;
        ctx.lineWidth = width + 6;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      // Glow dot at cursor
      const { x, y } = mouseRef.current;
      if (x > 0 && y > 0) {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 8);
        gradient.addColorStop(0, `hsla(${primary} / 0.4)`);
        gradient.addColorStop(1, `hsla(${primary} / 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[100] pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default LightsaberCursor;
