import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CategoryChips from "./CategoryChips";
import QualitySelector from "./QualitySelector";
import PlaylistToggle from "./PlaylistToggle";
import PlaylistProgress, { TrackStatus } from "./PlaylistProgress";
import { toast } from "sonner";
import { Link, Download, Loader2, ListMusic, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DownloadResult {
  title: string;
  author: string;
  thumbnail: string | null;
  downloadUrl: string | null;
  platform: string;
  instructions: string;
}

const MOCK_TRACKS = [
  "Never Gonna Give You Up",
  "Bohemian Rhapsody",
  "Blinding Lights",
  "Levitating",
  "Shape of You",
  "Watermelon Sugar",
  "Bad Guy",
];

const DownloadCard = () => {
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<"video" | "audio">("video");
  const [quality, setQuality] = useState("1080p");
  const [isPlaylist, setIsPlaylist] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tracks, setTracks] = useState<TrackStatus[]>([]);
  const [showProgress, setShowProgress] = useState(false);
  const [result, setResult] = useState<DownloadResult | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleModeChange = (newMode: "video" | "audio") => {
    setMode(newMode);
    setQuality(newMode === "video" ? "1080p" : "MP3 320");
  };

  const simulatePlaylistDownload = useCallback(() => {
    const initialTracks: TrackStatus[] = MOCK_TRACKS.map((title, i) => ({
      id: i,
      title,
      progress: 0,
      status: i === 0 ? "downloading" : "queued",
    }));
    setTracks(initialTracks);
    setShowProgress(true);

    let currentIdx = 0;
    intervalRef.current = setInterval(() => {
      setTracks((prev) => {
        const next = [...prev];
        const current = next[currentIdx];
        if (!current) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return prev;
        }

        if (current.progress < 100) {
          next[currentIdx] = {
            ...current,
            progress: Math.min(current.progress + Math.floor(Math.random() * 20 + 10), 100),
            status: "downloading",
          };
        }

        if (next[currentIdx].progress >= 100) {
          next[currentIdx] = { ...next[currentIdx], status: "done", progress: 100 };
          currentIdx++;
          if (currentIdx < next.length) {
            next[currentIdx] = { ...next[currentIdx], status: "downloading" };
          } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
            toast.info("Backend not connected. This was a demo simulation.");
          }
        }
        return next;
      });
    }, 400);
  }, []);

  const handleDownload = async () => {
    if (!url.trim()) {
      toast.error("Please paste a valid URL");
      return;
    }

    setIsProcessing(true);
    setResult(null);

    if (isPlaylist) {
      simulatePlaylistDownload();
      setTimeout(() => setIsProcessing(false), 1500);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("download", {
        body: { url: url.trim(), mode, quality },
      });

      if (error) throw new Error(error.message);

      if (!data?.success) {
        throw new Error(data?.error || "Download failed");
      }

      const downloadUrl = data.download?.url || null;
      const newResult: DownloadResult = {
        title: data.metadata?.title || "Unknown",
        author: data.metadata?.author || "Unknown",
        thumbnail: data.metadata?.thumbnail || null,
        downloadUrl,
        platform: data.download?.platform || "unknown",
        instructions: data.download?.instructions || "",
      };

      setResult(newResult);

      if (downloadUrl) {
        toast.success(`Found "${newResult.title}" by ${newResult.author}. Opening download...`);
      } else {
        toast.warning("Could not generate download link.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
      console.error("Download error:", err);
    } finally {
      setIsProcessing(false);
    }
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

      {/* Playlist Progress */}
      <PlaylistProgress tracks={tracks} mode={mode} visible={showProgress} />

      {/* Download Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full max-w-xl bg-card border border-border rounded-xl p-4 flex gap-4 items-center"
          >
            {result.thumbnail && (
              <img
                src={result.thumbnail}
                alt={result.title}
                className="w-20 h-14 rounded-lg object-cover shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-foreground font-semibold truncate text-sm">{result.title}</p>
              <p className="text-muted-foreground text-xs">{result.author}</p>
              {result.instructions && (
                <p className="text-muted-foreground text-xs mt-1 italic">{result.instructions}</p>
              )}
            </div>
            {result.downloadUrl && (
              <a
                href={result.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:brightness-110 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DownloadCard;
