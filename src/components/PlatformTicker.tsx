const platforms = [
  { icon: "♫", name: "SPOTIFY" },
  { icon: "☁", name: "SOUNDCLOUD" },
  { icon: "▷", name: "VIMEO" },
  { icon: "♪", name: "TIKTOK" },
  { icon: "✕", name: "TWITTER/X" },
  { icon: "◎", name: "INSTAGRAM" },
  { icon: "ƒ", name: "FACEBOOK" },
  { icon: "⚡", name: "TWITCH" },
  { icon: "◆", name: "DAILYMOTION" },
  { icon: "▶", name: "YOUTUBE" },
  { icon: "⚔", name: "JEDI ARCHIVES" },
  { icon: "★", name: "DEATH STAR DB" },
];

const PlatformTicker = () => {
  const doubled = [...platforms, ...platforms];

  return (
    <div className="w-full overflow-hidden border-y border-border py-5 md:py-6 bg-secondary/30 relative">
      {/* Subtle scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: `repeating-linear-gradient(0deg, transparent, transparent 3px, hsl(var(--primary) / 0.02) 3px, hsl(var(--primary) / 0.02) 4px)`,
        }}
      />
      <div className="flex ticker-scroll whitespace-nowrap relative z-10">
        {doubled.map((platform, i) => (
          <span
            key={i}
            className="mx-6 sm:mx-10 md:mx-14 text-xs sm:text-sm font-semibold tracking-widest uppercase text-muted-foreground flex items-center gap-2 sm:gap-3"
          >
            <span className="text-primary text-sm sm:text-base">{platform.icon}</span>
            {platform.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PlatformTicker;
