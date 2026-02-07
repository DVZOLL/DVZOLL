import { useCallback, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  life: number;
  maxLife: number;
  shape: "square" | "circle" | "line";
}

const COLORS = [
  "hsl(152, 100%, 50%)",
  "hsl(152, 80%, 60%)",
  "hsl(180, 80%, 50%)",
  "hsl(140, 90%, 45%)",
  "hsl(0, 0%, 95%)",
  "hsl(152, 100%, 70%)",
];

export const useConfetti = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number>(0);

  const fire = useCallback((originX?: number, originY?: number) => {
    // Create or reuse canvas
    let canvas = canvasRef.current;
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.style.cssText =
        "position:fixed;inset:0;z-index:9999;pointer-events:none;";
      document.body.appendChild(canvas);
      canvasRef.current = canvas;
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d")!;

    const cx = originX ?? canvas.width / 2;
    const cy = originY ?? canvas.height / 2;

    const particles: Particle[] = [];
    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 4;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: Math.random() * 6 + 3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        life: 0,
        maxLife: Math.random() * 60 + 40,
        shape: ["square", "circle", "line"][Math.floor(Math.random() * 3)] as Particle["shape"],
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      let alive = false;

      for (const p of particles) {
        p.life++;
        if (p.life > p.maxLife) continue;
        alive = true;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // gravity
        p.vx *= 0.99;
        p.rotation += p.rotationSpeed;

        const alpha = 1 - p.life / p.maxLife;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;

        if (p.shape === "square") {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -1, p.size, 2);
        }

        ctx.restore();
      }

      if (alive) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas!.width, canvas!.height);
        canvas!.remove();
        canvasRef.current = null;
      }
    };

    cancelAnimationFrame(animRef.current);
    animate();
  }, []);

  return fire;
};
