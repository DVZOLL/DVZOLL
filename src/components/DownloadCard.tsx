import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CategoryChips from "./CategoryChips";
import QualitySelector from "./QualitySelector";
import PlaylistToggle from "./PlaylistToggle";
import { toast } from "sonner";
import { Link, Download, Loader2, ListMusic } from "lucide-react";

const DownloadCard = () => {
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<"video" | "audio">("video");
  const [quality, setQuality] = useState("1080p");
  const [isPlaylist, setIsPlaylist] = useState(false);
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
    const downloadType = isPlaylist ? "playlist" : "single";
    setTimeout(() => {
      setIsProcessing(false);
      toast.info(`Backend not connected. Connect an API to enable ${downloadType} downloads.`);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-xl flex flex-col items-center gap-5 relative z-10"
    >
      {/* URL Input */}
      <div className="relative w-full">
        <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={isPlaylist ? "Paste playlist URL here..." : "Paste your media URL here..."}
          className="w-full bg-card border border-border rounded-xl pl-12 pr-5 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all duration-300 text-base"
        />
      </div>

      {/* Mode & Playlist Row */}
      <div className="flex flex-wrap items-center gap-4 justify-center">
        <CategoryChips mode={mode} onModeChange={handleModeChange} />
        <PlaylistToggle isPlaylist={isPlaylist} onToggle={setIsPlaylist} />
      </div>

      {/* Quality */}
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

      {/* Playlist info hint */}
      <AnimatePresence>
        {isPlaylist && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 text-xs text-primary/80"
          >
            <ListMusic className="w-4 h-4" />
            <span>All tracks in the playlist will be downloaded in {quality} quality</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleDownload}
        disabled={isProcessing}
        className="w-full max-w-xs bg-primary text-primary-foreground font-bold text-base uppercase tracking-widest py-4 rounded-xl hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            {isPlaylist ? <ListMusic className="w-5 h-5" /> : <Download className="w-5 h-5" />}
            {isPlaylist ? "Download Playlist" : "Download"}
          </>
        )}
      </motion.button>
    </motion.div>
  );
};

export default DownloadCard;
