import { motion } from "framer-motion";

const platforms = [
  "YouTube", "Spotify", "SoundCloud", "Vimeo", "Dailymotion",
  "TikTok", "Instagram", "Twitter/X", "Facebook", "Twitch",
  "Bandcamp", "Mixcloud", "Reddit", "Pinterest", "Tumblr",
];

const PlatformTicker = () => {
  const doubled = [...platforms, ...platforms];

  return (
    <div className="w-full overflow-hidden border-y border-border py-3 bg-secondary/50">
      <div className="flex ticker-scroll whitespace-nowrap">
        {doubled.map((platform, i) => (
          <span
            key={i}
            className="mx-6 text-sm font-medium tracking-wider uppercase text-muted-foreground"
          >
            {platform}
            <span className="ml-6 text-primary/40">●</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default PlatformTicker;
