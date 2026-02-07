import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SecretTerminalProps {
  visible: boolean;
  onClose: () => void;
}

const LINES = [
  { text: "$ initializing DVZOLL core...", delay: 0 },
  { text: "[OK] yt-dlp engine loaded", delay: 400 },
  { text: "[OK] spotdl bridge connected", delay: 800 },
  { text: "[OK] librespot handshake complete", delay: 1200 },
  { text: "$ running diagnostics...", delay: 1800 },
  { text: "[INFO] supported platforms: 1,337", delay: 2200 },
  { text: "[INFO] pop-ups blocked: ∞", delay: 2600 },
  { text: "[INFO] viruses downloaded: 0", delay: 3000 },
  { text: "[INFO] vibes: immaculate", delay: 3400 },
  { text: "$ echo $SECRET_MESSAGE", delay: 4000 },
  { text: "> Built with 🫠 by DvIsZoll at 2AM", delay: 4400 },
  { text: "> Thanks for finding this easter egg!", delay: 4800 },
  { text: "$ _", delay: 5200 },
];

const SecretTerminal = ({ visible, onClose }: SecretTerminalProps) => {
  const [visibleLines, setVisibleLines] = useState<number>(0);

  useEffect(() => {
    if (!visible) {
      setVisibleLines(0);
      return;
    }

    const timers = LINES.map((line, i) =>
      setTimeout(() => setVisibleLines(i + 1), line.delay)
    );

    return () => timers.forEach(clearTimeout);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-card border border-primary/30 rounded-xl overflow-hidden box-glow"
          >
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-secondary/50">
              <div className="flex gap-1.5">
                <button onClick={onClose} className="w-3 h-3 rounded-full bg-destructive hover:brightness-125 transition" />
                <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
              </div>
              <span className="text-xs text-muted-foreground font-mono ml-2">dvzoll@secret ~ %</span>
            </div>

            {/* Terminal body */}
            <div className="p-4 font-mono text-sm space-y-1 min-h-[300px] max-h-[400px] overflow-y-auto">
              {LINES.slice(0, visibleLines).map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={
                    line.text.startsWith("[OK]")
                      ? "text-primary"
                      : line.text.startsWith("[INFO]")
                      ? "text-muted-foreground"
                      : line.text.startsWith(">")
                      ? "text-foreground font-semibold"
                      : "text-foreground/70"
                  }
                >
                  {line.text}
                  {i === visibleLines - 1 && (
                    <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />
                  )}
                </motion.p>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SecretTerminal;
