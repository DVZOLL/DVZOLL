import { motion } from "framer-motion";
import { Zap, Shield, Infinity, Sparkles } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "Powered by yt-dlp and optimized servers for maximum speed",
  },
  {
    icon: Shield,
    title: "100% Secure",
    desc: "No data stored. Your downloads are private and encrypted",
  },
  {
    icon: Infinity,
    title: "Unlimited",
    desc: "No limits on file size or number of downloads",
  },
  {
    icon: Sparkles,
    title: "Best Quality",
    desc: "Up to 4K video and lossless FLAC audio support",
  },
];

const FeatureGrid = () => {
  return (
    <section className="w-full px-6 py-20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3">
            WHY <span className="text-primary">GRABIFY</span>?
          </h2>
          <p className="text-muted-foreground text-base">
            Built for speed, privacy, and the best possible quality
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
