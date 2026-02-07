import { motion } from "framer-motion";

interface CategoryChipsProps {
  mode: "video" | "audio";
  onModeChange: (mode: "video" | "audio") => void;
}

const CategoryChips = ({ mode, onModeChange }: CategoryChipsProps) => {
  return (
    <div className="flex gap-3">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onModeChange("video")}
        className={`px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-widest transition-all duration-200 ${
          mode === "video"
            ? "bg-primary text-primary-foreground box-glow"
            : "bg-secondary text-secondary-foreground border border-border hover:border-primary/50"
        }`}
      >
        ▶ Video
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onModeChange("audio")}
        className={`px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-widest transition-all duration-200 ${
          mode === "audio"
            ? "bg-primary text-primary-foreground box-glow"
            : "bg-secondary text-secondary-foreground border border-border hover:border-primary/50"
        }`}
      >
        ♫ Audio
      </motion.button>
    </div>
  );
};

export default CategoryChips;
