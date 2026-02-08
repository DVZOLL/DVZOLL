import { motion } from "framer-motion";
import { Zap, Shield, Infinity, Sparkles } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Hyperdrive Speed",
    desc: "Faster than the Kessel Run. Powered by yt-dlp's turbolasers.",
    swQuote: "She may not look like much, but she's got it where it counts.",
  },
  {
    icon: Shield,
    title: "Force Shield",
    desc: "Your data never touches Imperial servers. Fully encrypted.",
    swQuote: "The Force will be with you. Always.",
  },
  {
    icon: Infinity,
    title: "Unlimited Power",
    desc: "No limits on file size or number of downloads. Unlimited power!",
    swQuote: "Power! Unlimited power!",
  },
  {
    icon: Sparkles,
    title: "Holocron Quality",
    desc: "Up to 4K video and lossless FLAC audio from the Jedi Archives.",
    swQuote: "Impressive. Most impressive.",
  },
];

const FeatureGrid = () => {
  return (
    <section className="w-full px-5 sm:px-8 py-20 md:py-28">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter mb-4">
            WHY JOIN THE <span className="text-primary text-glow">REBELLION</span>?
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Built for speed, privacy, and the best possible quality in the galaxy
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-all hover:shadow-[0_0_20px_hsl(var(--primary)/0.1)]"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:shadow-[0_0_12px_hsl(var(--primary)/0.3)] transition-shadow">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">{f.desc}</p>
              <p className="text-xs italic text-primary/50 leading-relaxed">"{f.swQuote}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
