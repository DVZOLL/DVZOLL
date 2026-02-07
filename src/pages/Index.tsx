import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import PlatformTicker from "@/components/PlatformTicker";
import DownloadCard from "@/components/DownloadCard";
import FeatureGrid from "@/components/FeatureGrid";
import AboutSection from "@/components/AboutSection";
import { LogIn, LogOut, User } from "lucide-react";

const Index = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Ambient floating orbs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
        <div className="ambient-orb ambient-orb-3" />
      </div>

      {/* Top bar */}
      <header className="w-full flex items-center justify-end px-6 py-4 relative z-20">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              {user.email}
            </span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate("/auth")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-primary/40 text-sm text-primary font-medium hover:bg-primary/10 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </button>
        )}
      </header>

      {/* Hero Section with glow */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-10 pb-10 gap-8 relative z-10">
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

      {/* About & Story */}
      <AboutSection />

      {/* Footer */}
      <footer className="w-full px-6 py-8 border-t border-border text-center space-y-2 relative z-10">
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
