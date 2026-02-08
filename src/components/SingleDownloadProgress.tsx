import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle, FolderOpen, FileDown } from "lucide-react";

interface SingleDownloadProgressProps {
  visible: boolean;
  progress: number;
  status: "idle" | "fetching" | "downloading" | "converting" | "done" | "error";
  filename?: string;
  fileSize?: string;
  errorMessage?: string;
}

const SW_QUOTES_FETCHING = [
  "Reaching out with the Force…",
  "Acquiring target coordinates…",
  "Scanning the Outer Rim…",
];

const SW_QUOTES_DOWNLOADING = [
  "The data is strong with this one…",
  "Transferring from the Death Star archives…",
  "Hyperdrive engaged…",
  "Routing through the Kessel Run…",
  "Extracting from the Jedi Archives…",
];

const SW_QUOTES_CONVERTING = [
  "Assembling the holocron…",
  "Calibrating the lightsaber crystal…",
  "Translating from Aurebesh…",
];

const SW_QUOTES_DONE = [
  "The Force is with you. Always.",
  "This is the way.",
  "A fine addition to your collection.",
  "The circle is now complete.",
  "May the Force be with you.",
  "Impressive. Most impressive.",
];

const SW_QUOTES_ERROR = [
  "I have a bad feeling about this.",
  "The dark side clouds everything.",
  "It's a trap!",
];

function pickQuote(arr: string[], seed?: number): string {
  const idx = seed !== undefined ? seed % arr.length : Math.floor(Math.random() * arr.length);
  return arr[idx];
}

const statusConfig: Record<string, { quotes: string[]; label: string }> = {
  idle: { quotes: [], label: "" },
  fetching: { quotes: SW_QUOTES_FETCHING, label: "SCANNING" },
  downloading: { quotes: SW_QUOTES_DOWNLOADING, label: "TRANSMITTING" },
  converting: { quotes: SW_QUOTES_CONVERTING, label: "ASSEMBLING" },
  done: { quotes: SW_QUOTES_DONE, label: "COMPLETE" },
  error: { quotes: SW_QUOTES_ERROR, label: "FAILED" },
};

const SingleDownloadProgress = ({
  visible,
  progress,
  status,
  filename,
  fileSize,
  errorMessage,
}: SingleDownloadProgressProps) => {
  const config = statusConfig[status] || statusConfig.idle;
  const quote = config.quotes.length > 0 ? pickQuote(config.quotes, progress) : "";

  return (
    <AnimatePresence>
      {visible && status !== "idle" && (
        <motion.div
          initial={{ opacity: 0, height: 0, scale: 0.95 }}
          animate={{ opacity: 1, height: "auto", scale: 1 }}
          exit={{ opacity: 0, height: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-full"
        >
          <div className="relative overflow-hidden bg-[hsl(230,15%,8%)] border border-[hsl(45,80%,55%,0.2)] rounded-2xl p-5 space-y-4">
            {/* Starfield background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: `${Math.random() * 2 + 1}px`,
                    height: `${Math.random() * 2 + 1}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.6 + 0.1,
                    animation: `pulse ${Math.random() * 3 + 2}s ease-in-out infinite`,
                  }}
                />
              ))}
            </div>

            {/* Status header */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                {status === "done" ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-[hsl(45,80%,55%,0.15)] border border-[hsl(45,80%,55%,0.3)] flex items-center justify-center">
                      <Check className="w-4 h-4 text-[hsl(45,80%,55%)]" />
                    </div>
                  </motion.div>
                ) : status === "error" ? (
                  <div className="w-8 h-8 rounded-lg bg-destructive/15 border border-destructive/30 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-destructive" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full"
                    />
                  </div>
                )}

                <div>
                  <span
                    className="text-xs font-bold tracking-[0.2em] uppercase"
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      color:
                        status === "error"
                          ? "hsl(0, 72%, 51%)"
                          : status === "done"
                          ? "hsl(45, 80%, 55%)"
                          : "hsl(45, 80%, 75%)",
                    }}
                  >
                    {config.label}
                  </span>
                  <p
                    className="text-xs italic mt-0.5"
                    style={{ color: "hsl(45, 20%, 50%)", fontFamily: "'Inter', sans-serif" }}
                  >
                    "{quote}"
                  </p>
                </div>
              </div>

              {fileSize && (
                <span
                  className="text-xs font-mono font-bold"
                  style={{ color: "hsl(45, 80%, 55%)" }}
                >
                  {fileSize}
                </span>
              )}
            </div>

            {/* Lightsaber progress bar */}
            {(status === "downloading" || status === "converting") && (
              <div className="space-y-2 relative z-10">
                <div className="relative w-full h-3 bg-[hsl(230,15%,12%)] rounded-full overflow-hidden border border-[hsl(45,80%,55%,0.1)]">
                  {/* Lightsaber glow */}
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    style={{
                      background: `linear-gradient(90deg, hsl(var(--primary) / 0.6), hsl(var(--primary)))`,
                      boxShadow: `0 0 12px hsl(var(--primary) / 0.6), 0 0 24px hsl(var(--primary) / 0.3), 0 0 48px hsl(var(--primary) / 0.15)`,
                    }}
                  />
                  {/* Lightsaber tip glow */}
                  {progress > 2 && progress < 100 && (
                    <motion.div
                      className="absolute top-0 bottom-0 w-4 rounded-full"
                      animate={{ left: `calc(${progress}% - 8px)` }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      style={{
                        background: `radial-gradient(circle, hsl(var(--primary)), transparent)`,
                        filter: "blur(3px)",
                      }}
                    />
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span
                    className="text-sm font-bold font-mono"
                    style={{ color: "hsl(45, 80%, 55%)" }}
                  >
                    {progress}%
                  </span>
                  {filename && (
                    <span className="text-xs truncate ml-4 text-muted-foreground max-w-[200px]">
                      {filename}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Done state */}
            {status === "done" && filename && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm relative z-10"
                style={{ color: "hsl(45, 20%, 60%)" }}
              >
                <FileDown className="w-3.5 h-3.5 text-[hsl(45,80%,55%)]" />
                <span className="truncate">{filename}</span>
                <button className="ml-auto flex items-center gap-1.5 text-xs font-bold transition-colors hover:opacity-80" style={{ color: "hsl(45, 80%, 55%)" }}>
                  <FolderOpen className="w-3.5 h-3.5" />
                  Open folder
                </button>
              </motion.div>
            )}

            {/* Error state */}
            {status === "error" && errorMessage && (
              <p className="text-xs text-destructive/80 relative z-10">{errorMessage}</p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SingleDownloadProgress;
