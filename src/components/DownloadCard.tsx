import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CategoryChips from "./CategoryChips";
import QualitySelector from "./QualitySelector";
import PlaylistToggle from "./PlaylistToggle";
import PlaylistProgress, { TrackStatus } from "./PlaylistProgress";
import SingleDownloadProgress from "./SingleDownloadProgress";
import UrlPreview from "./UrlPreview";
import { toast } from "sonner";
import { Link, Download, Loader2, ListMusic, Settings } from "lucide-react";
import { useConfetti } from "@/hooks/useConfetti";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { useNavigate } from "react-router-dom";
import { isTauri, tauriDownload } from "@/lib/tauri";
import { useSettings } from "@/hooks/useSettings";

const MOCK_TRACKS = [
  "Never Gonna Give You Up",
  "Bohemian Rhapsody",
  "Blinding Lights",
  "Levitating",
  "Shape of You",
  "Watermelon Sugar",
  "Bad Guy",
];

const MOCK_FILENAMES: Record<string, string> = {
  video: "media_download.mp4",
  audio: "media_download.mp3",
};

const MOCK_SIZES: Record<string, string> = {
  "4K": "~2.1 GB",
  "2K": "~1.2 GB",
  "1080P": "~650 MB",
  "720P": "~350 MB",
  "FLAC": "~45 MB",
  "AAC": "~12 MB",
  "MP3 320": "~10 MB",
  "WAV": "~55 MB",
};

const isDesktop = isTauri();

const detectPlatform = (url: string): string => {
  const lower = url.toLowerCase();
  if (lower.includes("spotify.com")) return "spotify";
  if (lower.includes("youtube.com") || lower.includes("youtu.be")) return "youtube";
  return "other";
};

const mapQuality = (q: string): string => {
  const map: Record<string, string> = {
    "4K": "4k", "2K": "1440p", "1080P": "1080p", "720P": "720p",
    "FLAC": "flac", "AAC": "aac", "MP3 320": "mp3-320", "WAV": "wav",
  };
  return map[q] || q.toLowerCase();
};

const DownloadCard = () => {
  const { settings, update } = useSettings();
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<"video" | "audio">(settings.lastMode);
  const [quality, setQuality] = useState(settings.lastQuality);
  const [isPlaylist, setIsPlaylist] = useState(settings.lastIsPlaylist);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tracks, setTracks] = useState<TrackStatus[]>([]);
  const [showPlaylistProgress, setShowPlaylistProgress] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fireConfetti = useConfetti();
  const { playSuccess, playRickroll } = useSoundEffects();
  const navigate = useNavigate();

  // Single download progress state
  const [singleProgress, setSingleProgress] = useState(0);
  const [singleStatus, setSingleStatus] = useState<"idle" | "fetching" | "downloading" | "converting" | "done" | "error">("idle");
  const [singleFilename, setSingleFilename] = useState("");
  const singleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleModeChange = (newMode: "video" | "audio") => {
    setMode(newMode);
    const newQuality = newMode === "video" ? "1080P" : "MP3 320";
    setQuality(newQuality);
    update({ lastMode: newMode, lastQuality: newQuality });
  };

  // Persist quality and playlist changes
  useEffect(() => {
    update({ lastQuality: quality, lastIsPlaylist: isPlaylist });
  }, [quality, isPlaylist, update]);

  const simulatePlaylistDownload = useCallback(() => {
    const initialTracks: TrackStatus[] = MOCK_TRACKS.map((title, i) => ({
      id: i,
      title,
      progress: 0,
      status: i === 0 ? "downloading" : "queued",
    }));
    setTracks(initialTracks);
    setShowPlaylistProgress(true);

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
            playSuccess();
            fireConfetti();
            toast.success("Playlist download complete!" + (!isDesktop ? " (demo simulation)" : ""));
          }
        }
        return next;
      });
    }, 400);
  }, [fireConfetti, playSuccess]);

  const simulateSingleDownload = useCallback(() => {
    setSingleStatus("fetching");
    setSingleProgress(0);
    setSingleFilename("");

    // Phase 1: Fetching (1s)
    singleTimerRef.current = setTimeout(() => {
      setSingleStatus("downloading");
      setSingleFilename(MOCK_FILENAMES[mode]);
      let progress = 0;

      // Phase 2: Downloading (progress ticks)
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15 + 8);
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setSingleProgress(100);
          setSingleStatus("converting");

          // Phase 3: Converting (0.8s)
          setTimeout(() => {
            setSingleStatus("done");
            playSuccess();
            fireConfetti();
            toast.success("Download complete!" + (!isDesktop ? " (demo simulation)" : ""));
          }, 800);
        } else {
          setSingleProgress(progress);
        }
      }, 300);
    }, 1000);
  }, [mode, fireConfetti, playSuccess]);

  const handleRealDownload = async () => {
    setIsProcessing(true);
    setSingleStatus("fetching");
    setSingleProgress(0);
    setSingleFilename("");

    try {
      const platform = detectPlatform(url);
      const result = await tauriDownload({
        url,
        mode,
        quality: mapQuality(quality),
        platform,
        is_playlist: isPlaylist,
        output_dir: settings.downloadPath,
      });

      if (result.success) {
        setSingleStatus("done");
        setSingleProgress(100);
        setSingleFilename(result.output_path || "");
        playSuccess();
        fireConfetti();
        toast.success(result.message || "Download complete!", {
          description: result.output_path ? `Saved to ${result.output_path}` : undefined,
          duration: 5000,
        });
      } else {
        setSingleStatus("error");
        toast.error("Download failed", {
          description: result.message || "An unknown error occurred",
          duration: 6000,
        });
      }
    } catch (err: any) {
      setSingleStatus("error");
      toast.error("Download failed", {
        description: err?.message || "Check that yt-dlp and spotdl are installed",
        duration: 6000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!url.trim()) {
      toast.error("Please paste a valid URL");
      return;
    }

    // 🥚 Rickroll easter egg
    const rickrollPatterns = ["dQw4w9WgXcQ", "rickroll", "never gonna give you up", "rick astley"];
    if (rickrollPatterns.some((p) => url.toLowerCase().includes(p.toLowerCase()))) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        playRickroll();
        toast("🎵 Never Gonna Give You Up!", {
          description: "You just got rick-rolled by a download manager. Respect.",
          duration: 5000,
        });
      }, 1500);
      return;
    }

    // V1 (desktop): real download via Tauri
    if (isDesktop) {
      handleRealDownload();
      return;
    }

    // V0 (web): simulation
    setIsProcessing(true);
    if (isPlaylist) {
      simulatePlaylistDownload();
      setTimeout(() => setIsProcessing(false), 1500);
    } else {
      simulateSingleDownload();
      setTimeout(() => setIsProcessing(false), 1500);
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
      <div className="relative w-full group">
        <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleDownload()}
          placeholder={isPlaylist ? "Paste playlist URL here..." : "Paste your media URL here..."}
          className="w-full bg-card border border-border rounded-2xl pl-12 pr-14 py-4.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:box-glow transition-all duration-300 text-base"
        />
        <button
          onClick={() => navigate("/settings")}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
          title="Settings"
        >
          <Settings className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* URL Preview */}
      <UrlPreview url={url} />

      {/* Mode & Playlist Row */}
      <div className="flex flex-wrap items-center gap-3 justify-center">
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

      {/* Estimated size hint */}
      <AnimatePresence>
        {url && !isPlaylist && MOCK_SIZES[quality] && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-muted-foreground"
          >
            Estimated file size: <span className="text-foreground font-medium">{MOCK_SIZES[quality]}</span>
          </motion.p>
        )}
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
        className="w-full max-w-xs bg-primary text-primary-foreground font-bold text-base uppercase tracking-widest py-4.5 rounded-2xl hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 box-glow hover:box-glow-strong"
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

      {/* Single Download Progress */}
      {!isPlaylist && (
        <SingleDownloadProgress
          visible={singleStatus !== "idle"}
          progress={singleProgress}
          status={singleStatus}
          filename={singleFilename}
          fileSize={MOCK_SIZES[quality]}
        />
      )}

      {/* Playlist Progress */}
      <PlaylistProgress tracks={tracks} mode={mode} visible={showPlaylistProgress} />
    </motion.div>
  );
};

export default DownloadCard;
