import { motion } from "framer-motion";
import { Video, Music } from "lucide-react";

interface CategoryChipsProps {
  mode: "video" | "audio";
  onModeChange: (mode: "video" | "audio") => void;
}

const CategoryChips = ({ mode, onModeChange }: CategoryChipsProps) => {
  return (
    <div className="flex bg-card border border-border rounded-xl overflow-hidden">
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => onModeChange("video")}
        className={`flex items-center gap-2 px-8 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-200 ${
          mode === "video"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Video className="w-4 h-4" />
        Video
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => onModeChange("audio")}
        className={`flex items-center gap-2 px-8 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-200 ${
          mode === "audio"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Music className="w-4 h-4" />
        Audio
      </motion.button>
    </div>
  );
};

export default CategoryChips;
