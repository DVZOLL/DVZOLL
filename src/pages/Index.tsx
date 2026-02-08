import { useState, useCallback, useRef } from "react";
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
import logo from "@/assets/logo.png";

const Index = () => {
  const { activated: konamiActive, reset: resetKonami, activate: activateKonami } = useKonamiCode();
  const { playGlitch, playTerminalBoot } = useSoundEffects();
  const [glitchActive, setGlitchActive] = useState(false);
  const [headlineClicks, setHeadlineClicks] = useState(0);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [konamiPadOpen, setKonamiPadOpen] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

      {/* Mobile Konami pad — opened via long-press on ⚡ */}
      <KonamiPad open={konamiPadOpen} onClose={() => setKonamiPadOpen(false)} onActivate={activateKonami} />

      {/* Ambient floating orbs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
        <div className="ambient-orb ambient-orb-3" />
      </div>

      {/* Hero Section with glow */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 sm:px-8 pt-16 sm:pt-20 md:pt-24 pb-12 gap-8 sm:gap-10 relative z-10">
        {/* Background glow */}
        <div className="absolute inset-0 hero-glow pointer-events-none" />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-primary/40 text-primary text-sm font-medium tracking-wide">
            <img src={logo} alt="DVZOLL" className="w-5 h-5 rounded" />
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
            className="text-[2.75rem] sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-6 text-foreground leading-[1.02] cursor-default select-none"
          >
            GRAB ANY<br />
            <span className="text-primary text-glow">MEDIA</span> INSTANTLY
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-xl mx-auto px-2 leading-relaxed">
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
      <footer className="w-full px-6 py-10 border-t border-border text-center space-y-3 relative z-10">
        <p className="text-sm text-muted-foreground group">
          <span
            className="relative inline-block cursor-default select-none"
            onTouchStart={() => {
              longPressTimer.current = setTimeout(() => setKonamiPadOpen(true), 800);
            }}
            onTouchEnd={() => {
              if (longPressTimer.current) clearTimeout(longPressTimer.current);
            }}
            onTouchMove={() => {
              if (longPressTimer.current) clearTimeout(longPressTimer.current);
            }}
          >
            ⚡
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[10px] text-primary whitespace-nowrap bg-card border border-primary/30 px-2 py-1 rounded pointer-events-none">
              hold for secrets 👀
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
