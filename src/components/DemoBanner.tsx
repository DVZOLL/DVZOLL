import { motion } from "framer-motion";
import { Eye, ExternalLink } from "lucide-react";

const DemoBanner = () => {
  return (
    <motion.div
      initial={{ y: -40 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-primary text-primary-foreground"
    >
      <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-center gap-3 text-xs sm:text-sm font-bold uppercase tracking-widest">
        <Eye className="w-4 h-4 animate-pulse" />
        <span>V3 Preview — Interactive Demo</span>
        <span className="hidden sm:inline text-primary-foreground/70 font-normal normal-case tracking-normal">
          · All downloads are simulated
        </span>
        <a
          href="https://github.com/DvIsZoll/dvzoll"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary-foreground/15 hover:bg-primary-foreground/25 transition-colors text-xs font-semibold"
        >
          GitHub
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </motion.div>
  );
};

export default DemoBanner;
