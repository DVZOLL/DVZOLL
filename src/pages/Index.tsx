import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlatformTicker from "@/components/PlatformTicker";
import DownloadCard from "@/components/DownloadCard";
import FeatureGrid from "@/components/FeatureGrid";
import AboutSection from "@/components/AboutSection";
import MatrixRain from "@/components/MatrixRain";
import GlitchOverlay from "@/components/GlitchOverlay";
import SecretTerminal from "@/components/SecretTerminal";
import KonamiPad from "@/components/KonamiPad";
import { useKonamiCode } from "@/hooks/useKonamiCode";
import { useSoundEffects } from "@/hooks/useSoundEffects";

const Index = () => {
  const { activated: konamiActive, reset: resetKonami, activate: activateKonami } = useKonamiCode();
  const { playGlitch, playTerminalBoot } = useSoundEffects();
  const [glitchActive, setGlitchActive] = useState(false);
  const [headlineClicks, setHeadlineClicks] = useState(0);
  const [terminalOpen, setTerminalOpen] = useState(false);

  const handleHeadlineClick = () => {
    const next = headlineClicks + 1;
    setHeadlineClicks(next);
    if (next >= 7) {
      playGlitch();
      setGlitchActive(true);
      setHeadlineClicks(0);
    }
  };

  const handleGlitchComplete = useCallback(() => {
    setGlitchActive(false);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Easter egg overlays */}
      <AnimatePresence>
        {konamiActive && <MatrixRain onComplete={resetKonami} />}
      </AnimatePresence>
      <GlitchOverlay active={glitchActive} onComplete={handleGlitchComplete} />
      <SecretTerminal visible={terminalOpen} onClose={() => setTerminalOpen(false)} />

      {/* Mobile Konami pad */}
      <KonamiPad onActivate={activateKonami} />

      {/* Ambient floating orbs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
        <div className="ambient-orb ambient-orb-3" />
      </div>

      {/* Hero Section with glow */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pt-16 sm:pt-20 pb-10 gap-6 sm:gap-8 relative z-10">
        {/* Background glow */}
        <div className="absolute inset-0 hero-glow pointer-events-none" />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full border border-primary/40 text-primary text-xs sm:text-sm font-medium tracking-wide">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Universal Media Downloader
          </span>
        </motion.div>

        {/* Headline — click 7x for glitch */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center max-w-4xl relative z-10"
        >
          <h1
            onClick={handleHeadlineClick}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-5 text-foreground leading-[1.05] cursor-default select-none"
          >
            GRAB ANY<br />
            <span className="text-primary text-glow">MEDIA</span> INSTANTLY
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-xl mx-auto px-2">
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
      <AboutSection onAvatarSecret={() => { playTerminalBoot(); setTerminalOpen(true); }} />

      {/* Footer — hover the ⚡ to reveal secret */}
      <footer className="w-full px-6 py-8 border-t border-border text-center space-y-2 relative z-10">
        <p className="text-sm text-muted-foreground group">
          <span className="relative inline-block cursor-default">
            ⚡
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[10px] text-primary whitespace-nowrap bg-card border border-primary/30 px-2 py-1 rounded pointer-events-none">
              try ↑↑↓↓←→←→BA 👀
            </span>
          </span>{" "}
          Powered by yt-dlp • spotdl • librespot
        </p>
        <p className="text-xs text-muted-foreground">
          For educational purposes only. Respect copyright and terms of service.
        </p>
      </footer>
    </div>
  );
};

export default Index;
