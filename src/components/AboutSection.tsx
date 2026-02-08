import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Code2, Rocket, Heart } from "lucide-react";
import logo from "@/assets/logo.png";

interface AboutSectionProps {
  onAvatarSecret?: () => void;
}

const AboutSection = ({ onAvatarSecret }: AboutSectionProps) => {
  const [avatarClicks, setAvatarClicks] = useState(0);

  const handleAvatarClick = () => {
    const next = avatarClicks + 1;
    setAvatarClicks(next);
    if (next >= 5 && onAvatarSecret) {
      onAvatarSecret();
      setAvatarClicks(0);
    }
  };

  return (
    <section className="w-full px-5 sm:px-8 py-20 md:py-28 relative z-10">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* The Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              THE <span className="text-primary text-glow">ORIGIN</span> STORY
            </h2>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-4 text-muted-foreground leading-relaxed relative overflow-hidden">
            {/* Subtle star decoration */}
            <div className="absolute top-2 right-3 text-primary/10 text-2xl pointer-events-none">✦</div>
            <div className="absolute bottom-3 left-4 text-primary/10 text-lg pointer-events-none">★</div>
            <p>
              A long time ago, in a galaxy far, far away… One dev just wanted to download a single song.
              Twelve sketchy sites later — pop-ups, fake iPhone wins, 
              a file called <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-sm">totally_not_a_sith_lord.mp3.exe</code>, 
              and audio that sounded like a droid being crushed in a trash compactor.
            </p>
            <p>
              <span className="text-foreground font-medium">"Why is this still so hard in 2026?"</span> — So I built my own. 
              No pop-ups. No sketchy executables. Just clean, fast, maximum-quality downloads. 
              That's how <span className="text-primary font-bold">DVZOLL</span> was forged — 
              like a lightsaber crystal in the caves of Ilum.
            </p>
          </div>
        </motion.div>

        {/* About the Dev */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              MEET <span className="text-primary text-glow">DvIsZoll</span>
            </h2>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Avatar — click 5x for secret terminal */}
              <motion.div
                whileTap={{ scale: 0.9 }}
                onClick={handleAvatarClick}
                className="w-20 h-20 rounded-xl overflow-hidden shrink-0 cursor-pointer select-none hover:ring-2 hover:ring-primary/40 hover:shadow-[0_0_15px_hsl(var(--primary)/0.3)] transition-all"
                title="Click 5x if you dare, young Padawan…"
              >
                <img src={logo} alt="DZ" className="w-full h-full object-cover" />
              </motion.div>

              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Hey! I'm <span className="text-foreground font-bold">DvIsZoll</span> — a Padawan developer
                  at the very beginning of my coding journey. DVZOLL is one of my first real projects, 
                  and honestly? I'm learning something new every single day building it.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
                    <Rocket className="w-3.5 h-3.5" />
                    Padawan Dev
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
                    <Heart className="w-3.5 h-3.5" />
                    Force-Driven
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
                    <Code2 className="w-3.5 h-3.5" />
                    Learning the Ways
                  </span>
                </div>
                <p className="text-sm">
                  I believe the best way to learn is to build something real. DVZOLL is my lightsaber, 
                  my training ground, and my way of solving a problem that genuinely annoyed me. 
                  If you're using it — may the Force be with you! ⚔️
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
