import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface MatrixRainProps {
  onComplete: () => void;
}

const CHARS = "DVZOLL01アイウエオカキクケコ⚡▶♫◎✕☁◆";
const DURATION = 6000;

const MatrixRain = ({ onComplete }: MatrixRainProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Read the current --primary CSS variable and convert to usable color
    const rootStyle = getComputedStyle(document.documentElement);
    const primaryHSL = rootStyle.getPropertyValue("--primary").trim();
    const rainColor = primaryHSL ? `hsl(${primaryHSL})` : "hsl(152, 100%, 50%)";

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(10, 20, 15, 0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = rainColor;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.globalAlpha = Math.random() * 0.5 + 0.5;
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      ctx.globalAlpha = 1;
    };

    const interval = setInterval(draw, 40);
    const timeout = setTimeout(onComplete, DURATION);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] pointer-events-none"
    >
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="text-primary text-glow font-extrabold text-4xl md:text-6xl tracking-wider"
          style={{ fontFamily: "'Space Grotesk', monospace" }}
        >
          YOU FOUND IT
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-primary/60 text-sm mt-3 tracking-widest uppercase"
        >
          ↑↑↓↓←→←→BA • The Konami Code
        </motion.p>
      </div>
    </motion.div>
  );
};

export default MatrixRain;
