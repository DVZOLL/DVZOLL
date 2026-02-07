import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Check, Loader2, AlertCircle, FolderOpen, FileDown } from "lucide-react";

interface SingleDownloadProgressProps {
  visible: boolean;
  progress: number;
  status: "idle" | "fetching" | "downloading" | "converting" | "done" | "error";
  filename?: string;
  fileSize?: string;
  errorMessage?: string;
}

const statusLabels: Record<string, string> = {
  idle: "",
  fetching: "Fetching media info…",
  downloading: "Downloading…",
  converting: "Converting format…",
  done: "Download complete!",
  error: "Download failed",
};

const SingleDownloadProgress = ({
  visible,
  progress,
  status,
  filename,
  fileSize,
  errorMessage,
}: SingleDownloadProgressProps) => {
  return (
    <AnimatePresence>
      {visible && status !== "idle" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="w-full"
        >
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            {/* Status header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {status === "done" ? (
                  <Check className="w-4 h-4 text-primary" />
                ) : status === "error" ? (
                  <AlertCircle className="w-4 h-4 text-destructive" />
                ) : (
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                )}
                <span
                  className={`text-sm font-medium ${
                    status === "error" ? "text-destructive" : status === "done" ? "text-primary" : "text-foreground"
                  }`}
                >
                  {statusLabels[status]}
                </span>
              </div>
              {fileSize && (
                <span className="text-xs text-muted-foreground font-mono">{fileSize}</span>
              )}
            </div>

            {/* Progress bar */}
            {(status === "downloading" || status === "converting") && (
              <div className="space-y-1">
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{progress}%</span>
                  {filename && <span className="truncate ml-4">{filename}</span>}
                </div>
              </div>
            )}

            {/* Done state */}
            {status === "done" && filename && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileDown className="w-3.5 h-3.5" />
                <span className="truncate">{filename}</span>
                <button className="ml-auto flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors">
                  <FolderOpen className="w-3.5 h-3.5" />
                  Open folder
                </button>
              </div>
            )}

            {/* Error state */}
            {status === "error" && errorMessage && (
              <p className="text-xs text-destructive/80">{errorMessage}</p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SingleDownloadProgress;
