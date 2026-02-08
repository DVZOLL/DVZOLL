import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Music, Video } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export interface TrackStatus {
  id: number;
  title: string;
  progress: number;
  status: "queued" | "downloading" | "done" | "error";
}

interface PlaylistProgressProps {
  tracks: TrackStatus[];
  mode: "video" | "audio";
  visible: boolean;
}

const SW_TRACK_LABELS = [
  "Decrypting holocron",
  "Loading into cargo bay",
  "Hyperspace jump",
  "Transmitting data",
  "Force-pulling file",
  "Bypassing Imperial firewall",
  "Slicing into mainframe",
];

const PlaylistProgress = ({ tracks, mode, visible }: PlaylistProgressProps) => {
  const completed = tracks.filter((t) => t.status === "done").length;
  const total = tracks.length;
  const overallProgress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const Icon = mode === "video" ? Video : Music;

  return (
    <AnimatePresence>
      {visible && tracks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="w-full max-w-xl relative overflow-hidden"
        >
          <div className="bg-[hsl(230,15%,8%)] border border-[hsl(45,80%,55%,0.15)] rounded-xl p-5 space-y-4">
            {/* Starfield background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: `${Math.random() * 1.5 + 0.5}px`,
                    height: `${Math.random() * 1.5 + 0.5}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.4 + 0.1,
                    animation: `pulse ${Math.random() * 3 + 2}s ease-in-out infinite`,
                  }}
                />
              ))}
            </div>

            {/* Overall */}
            <div className="flex items-center justify-between text-sm relative z-10">
              <span className="text-foreground font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Downloading squadron…
              </span>
              <span className="font-bold font-mono" style={{ color: "hsl(45, 80%, 55%)" }}>
                {completed}/{total} targets
              </span>
            </div>
            <div className="relative z-10">
              <Progress value={overallProgress} className="h-2" />
            </div>

            {/* Per track */}
            <div className="max-h-48 overflow-y-auto space-y-2 pr-1 scrollbar-thin relative z-10">
              {tracks.map((track, idx) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 text-sm"
                >
                  <div className="w-6 h-6 flex items-center justify-center shrink-0">
                    {track.status === "done" ? (
                      <Check className="w-4 h-4" style={{ color: "hsl(45, 80%, 55%)" }} />
                    ) : track.status === "downloading" ? (
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    ) : (
                      <Icon className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <p
                      className={`truncate ${
                        track.status === "done"
                          ? "text-muted-foreground line-through"
                          : track.status === "downloading"
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {track.title}
                    </p>
                    {track.status === "downloading" && (
                      <div className="space-y-0.5">
                        <Progress value={track.progress} className="h-1" />
                        <p className="text-[10px] italic text-primary/40">
                          {SW_TRACK_LABELS[idx % SW_TRACK_LABELS.length]}…
                        </p>
                      </div>
                    )}
                  </div>

                  {track.status === "downloading" && (
                    <span className="text-xs font-mono w-10 text-right" style={{ color: "hsl(45, 80%, 55%)" }}>
                      {track.progress}%
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PlaylistProgress;
