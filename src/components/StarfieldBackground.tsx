import { useEffect, useRef } from "react";
import { playTieFighterScream } from "@/hooks/useStarWarsSounds";

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  brightness: number;
}

interface Starship {
  x: number;
  y: number;
  speed: number;
  size: number;
  type: "xwing" | "tie" | "falcon" | "destroyer";
  angle: number;
  trailLength: number;
  opacity: number;
}

const STAR_COUNT = 200;
const SHIP_COUNT = 5;

function createStar(w: number, h: number): Star {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    z: Math.random() * 3 + 0.5,
    size: Math.random() * 1.8 + 0.3,
    brightness: Math.random() * 0.6 + 0.2,
  };
}

function createShip(w: number, h: number): Starship {
  const types: Starship["type"][] = ["xwing", "tie", "falcon", "destroyer"];
  const type = types[Math.floor(Math.random() * types.length)];
  const goingRight = Math.random() > 0.5;
  return {
    x: goingRight ? -60 : w + 60,
    y: Math.random() * h * 0.7 + h * 0.05,
    speed: (Math.random() * 1.5 + 0.5) * (goingRight ? 1 : -1),
    size: type === "destroyer" ? 28 : type === "falcon" ? 18 : 12,
    type,
    angle: goingRight ? 0 : Math.PI,
    trailLength: type === "destroyer" ? 50 : type === "falcon" ? 35 : 20,
    opacity: Math.random() * 0.4 + 0.3,
  };
}

function drawShip(ctx: CanvasRenderingContext2D, ship: Starship, primaryColor: string) {
  ctx.save();
  ctx.translate(ship.x, ship.y);
  ctx.scale(ship.speed > 0 ? 1 : -1, 1);
  ctx.globalAlpha = ship.opacity;

  const s = ship.size;

  // Engine trail
  const gradient = ctx.createLinearGradient(-ship.trailLength, 0, 0, 0);
  gradient.addColorStop(0, "transparent");
  gradient.addColorStop(1, primaryColor);
  ctx.strokeStyle = gradient;
  ctx.lineWidth = s * 0.15;
  ctx.beginPath();
  ctx.moveTo(-ship.trailLength, 0);
  ctx.lineTo(-s * 0.3, 0);
  ctx.stroke();

  // Glow around engine
  ctx.shadowColor = primaryColor;
  ctx.shadowBlur = 8;

  ctx.fillStyle = "hsl(210, 10%, 70%)";
  ctx.strokeStyle = "hsl(210, 15%, 50%)";
  ctx.lineWidth = 0.5;

  if (ship.type === "xwing") {
    // X-Wing silhouette
    ctx.beginPath();
    ctx.moveTo(s * 0.5, 0);
    ctx.lineTo(-s * 0.3, -s * 0.1);
    ctx.lineTo(-s * 0.5, -s * 0.4);
    ctx.lineTo(-s * 0.35, -s * 0.4);
    ctx.lineTo(-s * 0.2, -s * 0.08);
    ctx.lineTo(-s * 0.3, 0);
    ctx.lineTo(-s * 0.2, s * 0.08);
    ctx.lineTo(-s * 0.35, s * 0.4);
    ctx.lineTo(-s * 0.5, s * 0.4);
    ctx.lineTo(-s * 0.3, s * 0.1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (ship.type === "tie") {
    // TIE Fighter silhouette
    ctx.fillStyle = "hsl(220, 10%, 50%)";
    // Wings
    ctx.fillRect(-s * 0.05, -s * 0.45, s * 0.1, s * 0.9);
    // Cockpit
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (ship.type === "falcon") {
    // Millennium Falcon silhouette
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.5, s * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Cockpit
    ctx.beginPath();
    ctx.ellipse(s * 0.35, -s * 0.15, s * 0.12, s * 0.08, 0.3, 0, Math.PI * 2);
    ctx.fillStyle = "hsl(200, 40%, 60%)";
    ctx.fill();
  } else {
    // Star Destroyer silhouette
    ctx.fillStyle = "hsl(220, 8%, 55%)";
    ctx.beginPath();
    ctx.moveTo(s * 0.6, 0);
    ctx.lineTo(-s * 0.5, -s * 0.25);
    ctx.lineTo(-s * 0.6, -s * 0.15);
    ctx.lineTo(-s * 0.6, s * 0.15);
    ctx.lineTo(-s * 0.5, s * 0.25);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Bridge
    ctx.fillStyle = "hsl(220, 10%, 45%)";
    ctx.fillRect(-s * 0.15, -s * 0.18, s * 0.15, s * 0.08);
  }

  ctx.restore();
}

const StarfieldBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const shipsRef = useRef<Starship[]>([]);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      starsRef.current = Array.from({ length: STAR_COUNT }, () => createStar(canvas.width, canvas.height));
      shipsRef.current = Array.from({ length: SHIP_COUNT }, () => createShip(canvas.width, canvas.height));
    };
    resize();
    window.addEventListener("resize", resize);

    const rootStyle = getComputedStyle(document.documentElement);

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;
      const primaryHSL = rootStyle.getPropertyValue("--primary").trim();
      const primaryColor = primaryHSL ? `hsl(${primaryHSL})` : "hsl(152, 100%, 50%)";

      ctx.fillStyle = "rgba(8, 12, 10, 0.15)";
      ctx.fillRect(0, 0, w, h);

      // Draw stars with parallax twinkle
      const time = Date.now() * 0.001;
      for (const star of starsRef.current) {
        const twinkle = Math.sin(time * star.z + star.x) * 0.3 + 0.7;
        ctx.globalAlpha = star.brightness * twinkle;
        ctx.fillStyle = Math.random() > 0.95 ? primaryColor : "white";
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Update & draw ships
      for (let i = 0; i < shipsRef.current.length; i++) {
        const ship = shipsRef.current[i];
        ship.x += ship.speed;
        // Respawn if off screen
        if ((ship.speed > 0 && ship.x > w + 80) || (ship.speed < 0 && ship.x < -80)) {
          const newShip = createShip(w, h);
          shipsRef.current[i] = newShip;
          // TIE Fighters scream when they appear
          if (newShip.type === "tie") {
            try { playTieFighterScream(); } catch {}
          }
        }
        drawShip(ctx, ship, primaryColor);
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
};

export default StarfieldBackground;
