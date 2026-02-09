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
import DarthVaderOverlay from "@/components/DarthVaderOverlay";
import StarfieldBackground from "@/components/StarfieldBackground";
import HyperspaceOverlay from "@/components/HyperspaceOverlay";
import { useKonamiCode } from "@/hooks/useKonamiCode";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { useStarWarsSounds } from "@/hooks/useStarWarsSounds";
import logo from "@/assets/logo.png";

const Index = () => {
  const { activated: konamiActive, reset: resetKonami, activate: activateKonami } = useKonamiCode();
  const { playGlitch, playTerminalBoot } = useSoundEffects();
  const { playHyperspaceJump } = useStarWarsSounds();
  const [glitchActive, setGlitchActive] = useState(false);
  const [headlineClicks, setHeadlineClicks] = useState(0);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [konamiPadOpen, setKonamiPadOpen] = useState(false);
  const [hyperspaceActive, setHyperspaceActive] = useState(false);
  const [vaderActive, setVaderActive] = useState(false);
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

  const handleHyperspaceComplete = useCallback(() => {
    setHyperspaceActive(false);
  }, []);

  const handleVaderComplete = useCallback(() => {
    setVaderActive(false);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Easter egg overlays */}
      <AnimatePresence>
        {konamiActive && <MatrixRain onComplete={resetKonami} />}
      </AnimatePresence>
      <GlitchOverlay active={glitchActive} onComplete={handleGlitchComplete} />
      <HyperspaceOverlay active={hyperspaceActive} onComplete={handleHyperspaceComplete} />
      <DarthVaderOverlay active={vaderActive} onComplete={handleVaderComplete} />
      <SecretTerminal visible={terminalOpen} onClose={() => setTerminalOpen(false)} />
      <KonamiPad open={konamiPadOpen} onClose={() => setKonamiPadOpen(false)} onActivate={activateKonami} />

      {/* Animated starfield with flying starships */}
      <StarfieldBackground />

      {/* Hero Section with glow */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 sm:px-8 pt-20 sm:pt-24 md:pt-28 pb-12 gap-8 sm:gap-10 relative z-10">
        {/* Background glow */}
        <div className="absolute inset-0 hero-glow pointer-events-none" />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-primary/40 text-primary text-sm font-medium tracking-wide shadow-[0_0_15px_hsl(var(--primary)/0.15)]">
            <img src={logo} alt="DVZOLL" className="w-5 h-5 rounded" />
            Galactic Media Downloader
          </span>
        </motion.div>

        {/* Headline */}
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
            <span className="text-primary text-glow">MEDIA</span> IN THE GALAXY
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-xl mx-auto px-2 leading-relaxed">
            Download videos and audio from YouTube, Spotify, and 1000+ systems.
            <br />
            Maximum quality. Zero Imperial interference.
          </p>
        </motion.div>

        {/* Download Controls */}
        <DownloadCard />

        {/* Hyperspace jump button — hidden easter egg */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          onClick={() => { playHyperspaceJump(); setHyperspaceActive(true); }}
          className="text-[10px] text-muted-foreground/30 hover:text-primary/60 transition-colors tracking-widest uppercase cursor-pointer select-none"
          title="Jump to hyperspace"
        >
          ✦ Make the jump to lightspeed ✦
        </motion.button>
      </main>

      {/* Ticker */}
      <PlatformTicker />

      {/* Features Section */}
      <FeatureGrid />

      {/* About & Story */}
      <AboutSection onAvatarSecret={() => { playTerminalBoot(); setTerminalOpen(true); }} />

      {/* Footer */}
      <footer className="w-full px-6 py-10 border-t border-border text-center space-y-3 relative z-10">
        <p className="text-sm text-muted-foreground group">
          <span
            className="relative inline-block cursor-pointer select-none"
            onClick={() => setVaderActive(true)}
            onTouchStart={() => {
              longPressTimer.current = setTimeout(() => setVaderActive(true), 800);
            }}
            onTouchEnd={() => {
              if (longPressTimer.current) clearTimeout(longPressTimer.current);
            }}
            onTouchMove={() => {
              if (longPressTimer.current) clearTimeout(longPressTimer.current);
            }}
          >
            ⚔️
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[10px] text-primary whitespace-nowrap bg-card border border-primary/30 px-2 py-1 rounded pointer-events-none">
              embrace the dark side 🖤
            </span>
          </span>{" "}
          Powered by yt-dlp • spotdl • librespot
        </p>
        <p className="text-xs text-muted-foreground">
          For educational purposes only. Respect copyright and the Jedi Code.
        </p>
        <p className="text-[10px] text-muted-foreground/30 italic">
          "Do. Or do not. There is no try." — Yoda
        </p>
      </footer>
    </div>
  );
};

export default Index;
