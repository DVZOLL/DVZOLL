import { motion } from "framer-motion";

interface QualitySelectorProps {
  mode: "video" | "audio";
  quality: string;
  onQualityChange: (quality: string) => void;
}

const videoQualities = ["4K", "2K", "1080p", "720p"];
const audioQualities = ["FLAC", "AAC", "MP3 320", "WAV"];

const QualitySelector = ({ mode, quality, onQualityChange }: QualitySelectorProps) => {
  const options = mode === "video" ? videoQualities : audioQualities;

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <motion.button
          key={opt}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onQualityChange(opt)}
          className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
            quality === opt
              ? "gradient-primary text-primary-foreground"
              : "bg-muted text-muted-foreground border border-border hover:text-foreground hover:border-primary/30"
          }`}
        >
          {opt}
        </motion.button>
      ))}
    </div>
  );
};

export default QualitySelector;
