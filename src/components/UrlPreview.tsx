import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Youtube, Music2, ExternalLink } from "lucide-react";

interface UrlPreviewProps {
  url: string;
}

const detectPlatform = (url: string): { name: string; icon: React.ReactNode; color: string } => {
  const lower = url.toLowerCase();
  if (lower.includes("youtube.com") || lower.includes("youtu.be")) {
    return { name: "YouTube", icon: <Youtube className="w-4 h-4" />, color: "text-red-500" };
  }
  if (lower.includes("spotify.com")) {
    return { name: "Spotify", icon: <Music2 className="w-4 h-4" />, color: "text-green-500" };
  }
  if (lower.includes("soundcloud.com")) {
    return { name: "SoundCloud", icon: <Music2 className="w-4 h-4" />, color: "text-orange-500" };
  }
  if (lower.includes("vimeo.com")) {
    return { name: "Vimeo", icon: <Globe className="w-4 h-4" />, color: "text-blue-400" };
  }
  if (lower.includes("tiktok.com")) {
    return { name: "TikTok", icon: <Globe className="w-4 h-4" />, color: "text-pink-500" };
  }
  if (lower.includes("twitter.com") || lower.includes("x.com")) {
    return { name: "X / Twitter", icon: <Globe className="w-4 h-4" />, color: "text-foreground" };
  }
  try {
    const hostname = new URL(url).hostname.replace("www.", "");
    return { name: hostname, icon: <Globe className="w-4 h-4" />, color: "text-muted-foreground" };
  } catch {
    return { name: "", icon: null, color: "" };
  }
};

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const UrlPreview = ({ url }: UrlPreviewProps) => {
  const [platform, setPlatform] = useState<ReturnType<typeof detectPlatform> | null>(null);

  useEffect(() => {
    if (url && isValidUrl(url)) {
      setPlatform(detectPlatform(url));
    } else {
      setPlatform(null);
    }
  }, [url]);

  return (
    <AnimatePresence>
      {platform && platform.name && (
        <motion.div
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -8, height: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full"
        >
          <div className="flex items-center gap-3 px-4 py-2.5 bg-card/80 border border-border rounded-lg backdrop-blur-sm">
            <span className={platform.color}>{platform.icon}</span>
            <span className="text-sm text-foreground font-medium">{platform.name}</span>
            <span className="text-xs text-muted-foreground truncate flex-1">{url}</span>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UrlPreview;
