import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CategoryChips from "./CategoryChips";
import QualitySelector from "./QualitySelector";
import { toast } from "sonner";

const DownloadCard = () => {
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<"video" | "audio">("video");
  const [quality, setQuality] = useState("1080p");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleModeChange = (newMode: "video" | "audio") => {
    setMode(newMode);
    setQuality(newMode === "video" ? "1080p" : "MP3 320");
  };

  const handleDownload = () => {
    if (!url.trim()) {
      toast.error("Please paste a valid URL");
      return;
    }
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.info("Backend not connected. Connect an API to enable downloads.");
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-2xl bg-card border border-border rounded-2xl p-8 box-glow"
    >
      {/* URL Input */}
      <div className="relative mb-6">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste your link here..."
          className="w-full bg-input border border-border rounded-xl px-5 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:box-glow transition-all duration-300 text-base"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-medium uppercase tracking-wider">
          URL
        </div>
      </div>

      {/* Mode Selector */}
      <div className="mb-6">
        <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Download Mode
        </label>
        <CategoryChips mode={mode} onModeChange={handleModeChange} />
      </div>

      {/* Quality */}
      <div className="mb-8">
        <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Quality
        </label>
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            <QualitySelector mode={mode} quality={quality} onQualityChange={setQuality} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleDownload}
        disabled={isProcessing}
        className="w-full gradient-primary text-primary-foreground font-bold text-lg uppercase tracking-widest py-4 rounded-xl animate-pulse-glow hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-3">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
            />
            Processing...
          </span>
        ) : (
          "⬇ Download Now"
        )}
      </motion.button>
    </motion.div>
  );
};

export default DownloadCard;
