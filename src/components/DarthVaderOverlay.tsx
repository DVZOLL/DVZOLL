import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { startVaderBreathing, stopVaderBreathing } from "@/hooks/useStarWarsSounds";

interface DarthVaderOverlayProps {
  active: boolean;
  onComplete: () => void;
}

const VADER_QUOTES = [
  "I find your lack of faith disturbing.",
  "The Force is strong with this one.",
  "You don't know the power of the dark side.",
  "I am altering the deal. Pray I don't alter it any further.",
  "Be careful not to choke on your aspirations.",
  "It is your destiny.",
  "The circle is now complete.",
];

const DarthVaderOverlay = ({ active, onComplete }: DarthVaderOverlayProps) => {
  const quote = VADER_QUOTES[Math.floor(Math.random() * VADER_QUOTES.length)];

  useEffect(() => {
    if (!active) return;
    startVaderBreathing();
    const timer = setTimeout(() => {
      stopVaderBreathing();
      onComplete();
    }, 5000);
    return () => {
      clearTimeout(timer);
      stopVaderBreathing();
    };
  }, [active, onComplete]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(180,0,0,0.15) 0%, rgba(0,0,0,0.92) 70%)",
          }}
        >
          {/* Red lightsaber glow line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[2px]"
            style={{
              background: "linear-gradient(90deg, transparent, #ff0000, #ff4444, #ff0000, transparent)",
              boxShadow: "0 0 30px 10px rgba(255,0,0,0.4), 0 0 60px 20px rgba(255,0,0,0.2)",
            }}
          />

          {/* Vader quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-center px-8 mt-16"
          >
            <p className="text-red-500 text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider italic max-w-2xl"
              style={{ textShadow: "0 0 20px rgba(255,0,0,0.6), 0 0 40px rgba(255,0,0,0.3)" }}
            >
              "{quote}"
            </p>
            <p className="text-red-400/60 text-sm mt-4 tracking-[0.3em] uppercase">
              — Darth Vader
            </p>
          </motion.div>

          {/* Breathing indicator */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <div className="w-4 h-4 rounded-full bg-red-600"
              style={{ boxShadow: "0 0 20px 8px rgba(255,0,0,0.4)" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DarthVaderOverlay;
