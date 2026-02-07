import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Code2, Rocket, Heart } from "lucide-react";

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
    <section className="w-full px-6 py-20 relative z-10">
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
              THE <span className="text-primary">ORIGIN</span> STORY
            </h2>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-4 text-muted-foreground leading-relaxed">
            <p>
              It all started at 2 AM on a Tuesday. I just wanted to download <em>one</em> song. 
              Simple, right? <span className="text-foreground font-medium">Wrong.</span>
            </p>
            <p>
              The first site gave me 47 pop-ups and tried to convince me I'd won an iPhone 15. 
              The second one downloaded a file called <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-sm">totally_not_a_virus.mp3.exe</code>. 
              The third one actually worked… but the audio quality sounded like it was recorded 
              inside a washing machine. During a spin cycle. Underwater.
            </p>
            <p>
              By site number twelve, I was questioning my life choices. My browser had more tabs open 
              than a bar on New Year's Eve. My antivirus was sending me concerned emails. I'm pretty 
              sure one site tried to mine Bitcoin using my toaster.
            </p>
            <p>
              That's when it hit me: <span className="text-foreground font-medium">
              "Why is downloading media in 2026 still harder than explaining crypto to your grandma?"</span>
            </p>
            <p>
              So I did what any reasonable, sleep-deprived developer would do — I built my own. 
              No pop-ups. No sketchy executables. No washing-machine audio. Just clean, fast, 
              maximum-quality downloads. And that, my friends, is how <span className="text-primary font-bold">DVZOLL</span> was born. 
              From frustration, caffeine, and a dream of downloading music without getting a computer virus.
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
              MEET <span className="text-primary">DvIsZoll</span>
            </h2>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Avatar — click 5x for secret terminal */}
              <motion.div
                whileTap={{ scale: 0.9 }}
                onClick={handleAvatarClick}
                className="w-20 h-20 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 cursor-pointer select-none hover:border-primary/40 transition-colors"
                title="..."
              >
                <span className="text-3xl font-extrabold text-primary">DZ</span>
              </motion.div>

              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Hey! I'm <span className="text-foreground font-bold">DvIsZoll</span> — a developer 
                  at the very beginning of my coding journey. DVZOLL is one of my first real projects, 
                  and honestly? I'm learning something new every single day building it.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
                    <Rocket className="w-3.5 h-3.5" />
                    Beginner Dev
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
                    <Heart className="w-3.5 h-3.5" />
                    Passion-Driven
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
                    <Code2 className="w-3.5 h-3.5" />
                    Learning Every Day
                  </span>
                </div>
                <p className="text-sm">
                  I believe the best way to learn is to build something real. DVZOLL is my playground, 
                  my portfolio piece, and my way of solving a problem that genuinely annoyed me. 
                  If you're using it — thanks for being part of the journey! 🚀
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
