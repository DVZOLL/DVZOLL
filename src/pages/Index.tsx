import { motion } from "framer-motion";
import PlatformTicker from "@/components/PlatformTicker";
import DownloadCard from "@/components/DownloadCard";
import FeatureGrid from "@/components/FeatureGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-5 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-primary text-2xl font-bold">⬇</span>
          <span className="text-lg font-bold tracking-tight text-foreground">
            Grab<span className="text-primary">Media</span>
          </span>
        </div>
        <span className="text-xs text-muted-foreground uppercase tracking-widest hidden sm:block">
          Universal Downloader
        </span>
      </header>

      {/* Ticker */}
      <PlatformTicker />

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 gap-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-foreground">
            Download <span className="gradient-text text-glow">Anything</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Paste a link from YouTube, Spotify, or 100+ platforms.
            <br />
            Choose your format. Hit download.
          </p>
        </motion.div>

        <DownloadCard />
        <FeatureGrid />
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-4 border-t border-border text-center text-xs text-muted-foreground">
        GrabMedia — For personal use only. Respect copyright laws.
      </footer>
    </div>
  );
};

export default Index;
