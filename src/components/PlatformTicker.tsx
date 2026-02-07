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
];

const PlatformTicker = () => {
  const doubled = [...platforms, ...platforms];

  return (
    <div className="w-full overflow-hidden border-y border-border py-4 bg-secondary/30">
      <div className="flex ticker-scroll whitespace-nowrap">
        {doubled.map((platform, i) => (
          <span
            key={i}
            className="mx-8 text-sm font-semibold tracking-widest uppercase text-muted-foreground flex items-center gap-2"
          >
            <span className="text-primary">{platform.icon}</span>
            {platform.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PlatformTicker;
