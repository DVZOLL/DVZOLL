import { motion } from "framer-motion";
import PlatformTicker from "@/components/PlatformTicker";
import DownloadCard from "@/components/DownloadCard";
import FeatureGrid from "@/components/FeatureGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section with glow */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-10 gap-8 relative">
        {/* Background glow */}
        <div className="absolute inset-0 hero-glow pointer-events-none" />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/40 text-primary text-sm font-medium tracking-wide">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Universal Media Downloader
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center max-w-4xl relative z-10"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-5 text-foreground leading-[1.05]">
            GRAB ANY<br />
            <span className="text-primary text-glow">MEDIA</span> INSTANTLY
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            Download videos and audio from YouTube, Spotify, and 1000+ platforms.
            <br />
            Maximum quality. Zero hassle.
          </p>
        </motion.div>

        {/* Download Controls */}
        <DownloadCard />
      </main>

      {/* Ticker */}
      <PlatformTicker />

      {/* Features Section */}
      <FeatureGrid />

      {/* Footer */}
      <footer className="w-full px-6 py-8 border-t border-border text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          ⚡ Powered by yt-dlp • spotdl • librespot
        </p>
        <p className="text-xs text-muted-foreground">
          For educational purposes only. Respect copyright and terms of service.
        </p>
      </footer>
    </div>
  );
};

export default Index;
