import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const KONAMI = ["up", "up", "down", "down", "left", "right", "left", "right", "b", "a"];

interface KonamiPadProps {
  open: boolean;
  onClose: () => void;
  onActivate: () => void;
}

const KonamiPad = ({ open, onClose, onActivate }: KonamiPadProps) => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [flash, setFlash] = useState(false);

  const progress = sequence.length;

  const press = useCallback(
    (key: string) => {
      setSequence((prev) => {
        const next = [...prev, key];
        if (next.length > KONAMI.length) return [key];
        if (next[next.length - 1] !== KONAMI[next.length - 1]) return [key];
        if (next.length === KONAMI.length) {
          setTimeout(() => {
            onActivate();
            onClose();
            setSequence([]);
          }, 200);
          setFlash(true);
          setTimeout(() => setFlash(false), 400);
        }
        return next;
      });
    },
    [onActivate, onClose]
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9990] bg-background/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Pad */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[9991] bg-card border rounded-2xl p-5 shadow-2xl ${
              flash ? "border-primary shadow-primary/20" : "border-border"
            } transition-colors`}
          >
            {/* Label */}
            <p className="text-[10px] text-muted-foreground text-center tracking-[0.2em] uppercase font-semibold mb-3">
              Use the Force, enter the code
            </p>

            {/* Progress dots — lightsaber style */}
            <div className="flex justify-center gap-1.5 mb-4">
              {KONAMI.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    i < progress ? "bg-primary scale-110 shadow-[0_0_6px_hsl(var(--primary)/0.6)]" : "bg-muted-foreground/20"
                  }`}
                />
              ))}
            </div>

            {/* D-pad */}
            <div className="grid grid-cols-3 gap-1.5 mb-4 mx-auto" style={{ width: 148 }}>
              <div />
              <PadBtn icon={<ChevronUp className="w-5 h-5" />} onPress={() => press("up")} />
              <div />
              <PadBtn icon={<ChevronLeft className="w-5 h-5" />} onPress={() => press("left")} />
              <div className="w-11 h-11" />
              <PadBtn icon={<ChevronRight className="w-5 h-5" />} onPress={() => press("right")} />
              <div />
              <PadBtn icon={<ChevronDown className="w-5 h-5" />} onPress={() => press("down")} />
              <div />
            </div>

            {/* A / B buttons */}
            <div className="flex justify-center gap-4">
              <PadBtn label="B" onPress={() => press("b")} round />
              <PadBtn label="A" onPress={() => press("a")} round />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const PadBtn = ({
  icon,
  label,
  onPress,
  round,
}: {
  icon?: React.ReactNode;
  label?: string;
  onPress: () => void;
  round?: boolean;
}) => (
  <motion.button
    whileTap={{ scale: 0.85, backgroundColor: "hsl(var(--primary) / 0.15)" }}
    onClick={onPress}
    className={`${
      round ? "w-11 h-11 rounded-full" : "w-11 h-11 rounded-lg"
    } bg-secondary/60 border border-border flex items-center justify-center text-foreground font-bold text-sm active:border-primary/50 transition-colors`}
  >
    {icon || label}
  </motion.button>
);

export default KonamiPad;
