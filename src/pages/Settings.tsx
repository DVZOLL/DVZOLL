import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FolderOpen,
  HardDrive,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Download,
  Terminal,
  Wrench,
  Info,
  Film,
  Music,
} from "lucide-react";
import logo from "@/assets/logo.png";

interface ToolInfo {
  name: string;
  description: string;
  status: "installed" | "missing" | "checking";
  version?: string;
  path: string;
  installCmd: string;
}

const DEFAULT_TOOLS: ToolInfo[] = [
  {
    name: "yt-dlp",
    description: "YouTube & 1000+ sites",
    status: "installed",
    version: "2024.12.06",
    path: "/usr/local/bin/yt-dlp",
    installCmd: "brew install yt-dlp",
  },
  {
    name: "spotdl",
    description: "Spotify downloads",
    status: "installed",
    version: "4.2.10",
    path: "/usr/local/bin/spotdl",
    installCmd: "pip3 install spotdl",
  },
  {
    name: "ffmpeg",
    description: "Audio/video processing",
    status: "installed",
    version: "7.1",
    path: "/usr/local/bin/ffmpeg",
    installCmd: "brew install ffmpeg",
  },
];

const VIDEO_QUALITIES = ["4K", "2K", "1080P", "720P"] as const;
const AUDIO_QUALITIES = ["FLAC", "AAC", "MP3 320", "WAV"] as const;

const sectionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.06, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  }),
};

const Settings = () => {
  const navigate = useNavigate();
  const [downloadPath, setDownloadPath] = useState("~/Downloads/DVZOLL");
  const [tools, setTools] = useState<ToolInfo[]>(DEFAULT_TOOLS);
  const [isChecking, setIsChecking] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [concurrentDownloads, setConcurrentDownloads] = useState(3);
  const [defaultVideoQuality, setDefaultVideoQuality] = useState("1080P");
  const [defaultAudioQuality, setDefaultAudioQuality] = useState("MP3 320");

  const handleCheckTools = () => {
    setIsChecking(true);
    setTools((prev) => prev.map((t) => ({ ...t, status: "checking" as const })));

    setTimeout(() => {
      setTools((prev) =>
        prev.map((t) => ({
          ...t,
          status: Math.random() > 0.15 ? ("installed" as const) : ("missing" as const),
        }))
      );
      setIsChecking(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Ambient orbs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex items-center gap-4 mb-10"
        >
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-card border border-border hover:border-primary/40 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex items-center gap-3">
            <img src={logo} alt="DVZOLL" className="w-8 h-8 rounded-lg" />
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Settings</h1>
              <p className="text-sm text-muted-foreground">Configure downloads & tools</p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          {/* Download Path Section */}
          <motion.section
            custom={0}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="bg-card border border-border rounded-xl p-5 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">Download Location</h2>
                <p className="text-xs text-muted-foreground">Where files are saved on your machine</p>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={downloadPath}
                onChange={(e) => setDownloadPath(e.target.value)}
                className="flex-1 bg-input border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors font-mono"
              />
              <button className="px-4 py-2.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2">
                <FolderOpen className="w-4 h-4" />
                Browse
              </button>
            </div>

            <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg border border-primary/10">
              <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                In the desktop app, you can browse and select any folder. The web app uses this as a
                display preference only.
              </p>
            </div>
          </motion.section>

          {/* Default Quality Section */}
          <motion.section
            custom={1}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="bg-card border border-border rounded-xl p-5 space-y-5"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Film className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">Default Quality</h2>
                <p className="text-xs text-muted-foreground">Pre-selected quality for new downloads</p>
              </div>
            </div>

            {/* Video quality */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Film className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Video</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {VIDEO_QUALITIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => setDefaultVideoQuality(q)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      defaultVideoQuality === q
                        ? "bg-primary text-primary-foreground box-glow"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Audio quality */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Music className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Audio</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {AUDIO_QUALITIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => setDefaultAudioQuality(q)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      defaultAudioQuality === q
                        ? "bg-primary text-primary-foreground box-glow"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Download Preferences */}
          <motion.section
            custom={2}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="bg-card border border-border rounded-xl p-5 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Download className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">Download Preferences</h2>
                <p className="text-xs text-muted-foreground">Default behavior for new downloads</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm text-foreground">Concurrent downloads</p>
                  <p className="text-xs text-muted-foreground">Max simultaneous downloads for playlists</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setConcurrentDownloads(Math.max(1, concurrentDownloads - 1))}
                    className="w-8 h-8 rounded-md bg-secondary text-secondary-foreground text-sm font-bold hover:bg-secondary/80 transition-colors"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-foreground">{concurrentDownloads}</span>
                  <button
                    onClick={() => setConcurrentDownloads(Math.min(8, concurrentDownloads + 1))}
                    className="w-8 h-8 rounded-md bg-secondary text-secondary-foreground text-sm font-bold hover:bg-secondary/80 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="border-t border-border" />

              <label className="flex items-center justify-between py-2 cursor-pointer">
                <div>
                  <p className="text-sm text-foreground">Auto-update tools</p>
                  <p className="text-xs text-muted-foreground">Keep yt-dlp and spotdl updated automatically</p>
                </div>
                <div
                  onClick={() => setAutoUpdate(!autoUpdate)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    autoUpdate ? "bg-primary" : "bg-secondary"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-primary-foreground rounded-full absolute top-0.5 transition-transform ${
                      autoUpdate ? "translate-x-[22px]" : "translate-x-0.5"
                    }`}
                  />
                </div>
              </label>

              <div className="border-t border-border" />

              <label className="flex items-center justify-between py-2 cursor-pointer">
                <div>
                  <p className="text-sm text-foreground">Notifications</p>
                  <p className="text-xs text-muted-foreground">Show notification when download completes</p>
                </div>
                <div
                  onClick={() => setNotifications(!notifications)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    notifications ? "bg-primary" : "bg-secondary"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-primary-foreground rounded-full absolute top-0.5 transition-transform ${
                      notifications ? "translate-x-[22px]" : "translate-x-0.5"
                    }`}
                  />
                </div>
              </label>
            </div>
          </motion.section>

          {/* Tools Section */}
          <motion.section
            custom={3}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="bg-card border border-border rounded-xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">Tool Status</h2>
                  <p className="text-xs text-muted-foreground">Required download engines</p>
                </div>
              </div>
              <button
                onClick={handleCheckTools}
                disabled={isChecking}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? "animate-spin" : ""}`} />
                {isChecking ? "Checking…" : "Re-check"}
              </button>
            </div>

            <div className="space-y-2">
              {tools.map((tool) => (
                <div
                  key={tool.name}
                  className="flex items-center gap-4 p-3 rounded-lg bg-background/50 border border-border/50"
                >
                  <div className="shrink-0">
                    {tool.status === "installed" ? (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    ) : tool.status === "missing" ? (
                      <XCircle className="w-5 h-5 text-destructive" />
                    ) : (
                      <RefreshCw className="w-5 h-5 text-muted-foreground animate-spin" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{tool.name}</span>
                      {tool.version && tool.status === "installed" && (
                        <span className="text-xs text-muted-foreground font-mono">v{tool.version}</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{tool.description}</p>
                  </div>

                  <div className="shrink-0 text-right">
                    {tool.status === "installed" ? (
                      <p className="text-xs text-muted-foreground font-mono truncate max-w-[160px]">{tool.path}</p>
                    ) : tool.status === "missing" ? (
                      <code className="text-xs bg-secondary px-2 py-1 rounded text-foreground font-mono">
                        {tool.installCmd}
                      </code>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg border border-primary/10">
              <Terminal className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                In the desktop app, tools are auto-detected and can be installed with one click.
                Run <code className="text-foreground bg-secondary px-1 rounded">./scripts/setup-macos.sh</code> to install all prerequisites at once.
              </p>
            </div>
          </motion.section>

          {/* Storage info */}
          <motion.section
            custom={4}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="bg-card border border-border rounded-xl p-5 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <HardDrive className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">Storage</h2>
                <p className="text-xs text-muted-foreground">Disk usage from DVZOLL downloads</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Used</span>
                <span className="text-foreground font-medium">2.4 GB</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: "24%" }} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>47 files</span>
                <span>10 GB available</span>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.3 }}
          className="text-center text-xs text-muted-foreground mt-10"
        >
          DVZOLL v3.0.0-preview — Settings saved automatically
        </motion.p>
      </div>
    </div>
  );
};

export default Settings;
