import { useState } from "react";
import { motion } from "framer-motion";
import { Music } from "lucide-react";
import { startCantinaBand, stopCantinaBand, isCantinaBandPlaying } from "@/hooks/useStarWarsSounds";

const CantinaBandToggle = () => {
  const [playing, setPlaying] = useState(isCantinaBandPlaying);

  const toggle = () => {
    if (playing) {
      stopCantinaBand();
      setPlaying(false);
    } else {
      startCantinaBand();
      setPlaying(true);
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggle}
      className={`fixed bottom-4 left-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all duration-300 ${
        playing
          ? "bg-primary text-primary-foreground border-primary shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
          : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/30"
      }`}
      title={playing ? "Stop Cantina Band" : "Play Cantina Band"}
    >
      <Music className={`w-4 h-4 ${playing ? "animate-pulse" : ""}`} />
      {playing ? "♫ Cantina" : "Cantina Band"}
    </motion.button>
  );
};

export default CantinaBandToggle;
