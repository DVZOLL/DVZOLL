import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Music, Video } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export interface TrackStatus {
  id: number;
  title: string;
  progress: number; // 0-100
  status: "queued" | "downloading" | "done" | "error";
}

interface PlaylistProgressProps {
  tracks: TrackStatus[];
  mode: "video" | "audio";
  visible: boolean;
}

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
          className="w-full max-w-xl bg-card border border-border rounded-xl p-5 space-y-4"
        >
          {/* Overall */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground font-semibold">
              Downloading playlist…
            </span>
            <span className="text-primary font-bold">
              {completed}/{total} tracks
            </span>
          </div>
          <Progress value={overallProgress} className="h-2" />

          {/* Per track */}
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
            {tracks.map((track) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 text-sm"
              >
                {/* Status icon */}
                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                  {track.status === "done" ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : track.status === "downloading" ? (
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  ) : (
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>

                {/* Title + bar */}
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
                    <Progress value={track.progress} className="h-1" />
                  )}
                </div>

                {/* Percentage */}
                {track.status === "downloading" && (
                  <span className="text-xs text-primary font-mono w-10 text-right">
                    {track.progress}%
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PlaylistProgress;
