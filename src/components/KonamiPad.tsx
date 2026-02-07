import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Gamepad2 } from "lucide-react";

const KONAMI = ["up", "up", "down", "down", "left", "right", "left", "right", "b", "a"];

interface KonamiPadProps {
  onActivate: () => void;
}

const KonamiPad = ({ onActivate }: KonamiPadProps) => {
  const [open, setOpen] = useState(false);
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
            setOpen(false);
            setSequence([]);
          }, 200);
          setFlash(true);
          setTimeout(() => setFlash(false), 400);
        }
        return next;
      });
    },
    [onActivate]
  );

  return (
    <div className="fixed bottom-6 left-6 z-50 md:hidden">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className="w-11 h-11 rounded-full bg-card border border-border flex items-center justify-center shadow-lg hover:border-primary/40 transition-colors"
        title="Konami pad"
      >
        <Gamepad2 className="w-5 h-5 text-primary" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className={`absolute bottom-14 left-0 bg-card border rounded-xl p-4 shadow-xl ${
              flash ? "border-primary shadow-primary/30" : "border-border"
            } transition-colors`}
          >
            {/* Progress dots */}
            <div className="flex justify-center gap-1 mb-3">
              {KONAMI.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i < progress ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>

            {/* D-pad */}
            <div className="grid grid-cols-3 gap-1 mb-3" style={{ width: 132 }}>
              <div />
              <PadBtn icon={<ChevronUp className="w-5 h-5" />} onPress={() => press("up")} />
              <div />
              <PadBtn icon={<ChevronLeft className="w-5 h-5" />} onPress={() => press("left")} />
              <div className="w-10 h-10" />
              <PadBtn icon={<ChevronRight className="w-5 h-5" />} onPress={() => press("right")} />
              <div />
              <PadBtn icon={<ChevronDown className="w-5 h-5" />} onPress={() => press("down")} />
              <div />
            </div>

            {/* A / B buttons */}
            <div className="flex justify-center gap-3">
              <PadBtn label="B" onPress={() => press("b")} />
              <PadBtn label="A" onPress={() => press("a")} />
            </div>

            <p className="text-[9px] text-muted-foreground text-center mt-2 tracking-wide">
              ↑↑↓↓←→←→BA
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PadBtn = ({
  icon,
  label,
  onPress,
}: {
  icon?: React.ReactNode;
  label?: string;
  onPress: () => void;
}) => (
  <motion.button
    whileTap={{ scale: 0.85, backgroundColor: "hsl(var(--primary) / 0.2)" }}
    onClick={onPress}
    className="w-10 h-10 rounded-lg bg-secondary/60 border border-border flex items-center justify-center text-foreground font-bold text-sm active:border-primary/50 transition-colors"
  >
    {icon || label}
  </motion.button>
);

export default KonamiPad;
