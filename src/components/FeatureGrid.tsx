import { motion } from "framer-motion";

const features = [
  { icon: "⚡", title: "Lightning Fast", desc: "Powered by yt-dlp engine" },
  { icon: "🎵", title: "Multi-Platform", desc: "YouTube, Spotify & more" },
  { icon: "🔒", title: "Private & Secure", desc: "No data stored on servers" },
  { icon: "💎", title: "Lossless Quality", desc: "Up to 4K video & FLAC audio" },
];

const FeatureGrid = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
      {features.map((f, i) => (
        <motion.div
          key={f.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
          className="bg-card border border-border rounded-xl p-4 text-center hover:border-primary/30 transition-colors"
        >
          <div className="text-2xl mb-2">{f.icon}</div>
          <h3 className="text-sm font-bold text-foreground mb-1">{f.title}</h3>
          <p className="text-xs text-muted-foreground">{f.desc}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default FeatureGrid;
