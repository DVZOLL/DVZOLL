import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GlitchOverlayProps {
  active: boolean;
  onComplete: () => void;
}

const GlitchOverlay = ({ active, onComplete }: GlitchOverlayProps) => {
  const [glitchPhase, setGlitchPhase] = useState(0);

  useEffect(() => {
    if (!active) return;

    const phases = [
      setTimeout(() => setGlitchPhase(1), 0),
      setTimeout(() => setGlitchPhase(2), 300),
      setTimeout(() => setGlitchPhase(3), 600),
      setTimeout(() => setGlitchPhase(4), 900),
      setTimeout(() => setGlitchPhase(5), 1500),
      setTimeout(() => {
        setGlitchPhase(0);
        onComplete();
      }, 2500),
    ];

    return () => phases.forEach(clearTimeout);
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9997] pointer-events-none"
      >
        {/* Scan lines */}
        <div
          className="absolute inset-0"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              hsl(var(--primary) / 0.03) 2px,
              hsl(var(--primary) / 0.03) 4px
            )`,
          }}
        />

        {/* RGB shift blocks */}
        {glitchPhase >= 1 && glitchPhase <= 4 && (
          <>
            <div
              className="absolute bg-primary/20"
              style={{
                top: `${20 + glitchPhase * 12}%`,
                left: 0,
                right: 0,
                height: `${3 + glitchPhase}px`,
                transform: `translateX(${glitchPhase % 2 === 0 ? 8 : -8}px)`,
              }}
            />
            <div
              className="absolute bg-destructive/15"
              style={{
                top: `${40 + glitchPhase * 8}%`,
                left: 0,
                right: 0,
                height: "2px",
                transform: `translateX(${glitchPhase % 2 === 0 ? -12 : 12}px)`,
              }}
            />
          </>
        )}

        {/* Center message — Star Wars themed */}
        {glitchPhase >= 5 && (
          <motion.div
            initial={{ opacity: 0, scale: 1.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-center">
              <p
                className="text-primary text-glow font-extrabold text-2xl md:text-4xl tracking-[0.3em] uppercase"
                style={{ fontFamily: "'Space Grotesk', monospace" }}
              >
                DISTURBANCE IN THE FORCE
              </p>
              <p className="text-muted-foreground text-xs mt-2 tracking-widest">
                CLICK THE HEADLINE 7 TIMES TO ACTIVATE
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default GlitchOverlay;
