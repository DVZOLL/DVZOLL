import { motion } from "framer-motion";
import { playR2D2Beep } from "@/hooks/useStarWarsSounds";

interface QualitySelectorProps {
  mode: "video" | "audio";
  quality: string;
  onQualityChange: (quality: string) => void;
}

const videoQualities = ["4K", "2K", "1080P", "720P"];
const audioQualities = ["FLAC", "AAC", "MP3 320", "WAV"];

const QualitySelector = ({ mode, quality, onQualityChange }: QualitySelectorProps) => {
  const options = mode === "video" ? videoQualities : audioQualities;

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {options.map((opt) => (
        <motion.button
          key={opt}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { playR2D2Beep(); onQualityChange(opt); }}
          className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
            quality === opt
              ? "bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground border border-border hover:text-foreground hover:border-primary/30"
          }`}
        >
          {opt}
        </motion.button>
      ))}
    </div>
  );
};

export default QualitySelector;
