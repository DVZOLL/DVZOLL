import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HyperspaceOverlayProps {
  active: boolean;
  onComplete: () => void;
  duration?: number;
}

const HyperspaceOverlay = ({ active, onComplete, duration = 3000 }: HyperspaceOverlayProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    interface HyperStar {
      x: number;
      y: number;
      z: number;
    }

    const stars: HyperStar[] = Array.from({ length: 400 }, () => ({
      x: (Math.random() - 0.5) * canvas.width * 2,
      y: (Math.random() - 0.5) * canvas.height * 2,
      z: Math.random() * 1500 + 100,
    }));

    const rootStyle = getComputedStyle(document.documentElement);
    const primaryHSL = rootStyle.getPropertyValue("--primary").trim();
    const primaryColor = primaryHSL ? `hsl(${primaryHSL})` : "hsl(152, 100%, 50%)";

    let frame = 0;
    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const star of stars) {
        star.z -= 30;
        if (star.z <= 0) star.z = 1500;

        const sx = (star.x / star.z) * 300 + cx;
        const sy = (star.y / star.z) * 300 + cy;
        const px = (star.x / (star.z + 30)) * 300 + cx;
        const py = (star.y / (star.z + 30)) * 300 + cy;

        const brightness = 1 - star.z / 1500;
        ctx.strokeStyle = brightness > 0.5 ? primaryColor : `rgba(255, 255, 255, ${brightness})`;
        ctx.lineWidth = brightness * 2.5;
        ctx.globalAlpha = brightness;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    const timer = setTimeout(onComplete, duration);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [active, onComplete, duration]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] pointer-events-none"
        >
          <canvas ref={canvasRef} className="w-full h-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.p
              initial={{ opacity: 0, scale: 2, letterSpacing: "0.5em" }}
              animate={{ opacity: 1, scale: 1, letterSpacing: "0.3em" }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-primary text-glow font-extrabold text-3xl md:text-5xl uppercase"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              PUNCH IT, CHEWIE!
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HyperspaceOverlay;
