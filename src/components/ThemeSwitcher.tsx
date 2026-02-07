import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTheme } from "@/hooks/useThemeContext";
import { Palette } from "lucide-react";

const ThemeSwitcher = () => {
  const { theme, setTheme, themes } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className="w-11 h-11 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary/40 transition-colors shadow-lg"
        title="Change theme"
      >
        <Palette className="w-5 h-5 text-primary" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-14 right-0 bg-card border border-border rounded-xl p-3 space-y-2 min-w-[160px] shadow-xl"
          >
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold px-1">
              Theme
            </p>
            {themes.map((t) => (
              <button
                key={t.name}
                onClick={() => {
                  setTheme(t.name);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  theme === t.name
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border-2 shrink-0"
                  style={{
                    backgroundColor: t.accent,
                    borderColor: theme === t.name ? t.accent : "transparent",
                    boxShadow: theme === t.name ? `0 0 8px ${t.accent}` : "none",
                  }}
                />
                {t.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSwitcher;
