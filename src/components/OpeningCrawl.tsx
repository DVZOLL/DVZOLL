import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CRAWL_TEXT = [
  "Episode IV.20",
  "A NEW DOWNLOAD",
  "",
  "It is a period of media chaos.",
  "Rebel downloaders, striking",
  "from a hidden base, have won",
  "their first victory against",
  "the evil Corporate Empire.",
  "",
  "During the battle, Rebel",
  "spies managed to steal secret",
  "plans to the Empire's",
  "ultimate weapon, the DMCA",
  "STAR, an armored legal",
  "station with enough power to",
  "destroy an entire media",
  "library.",
  "",
  "Pursued by the Empire's",
  "sinister agents, Princess",
  "DVZOLL races home aboard her",
  "starship, custodian of the",
  "stolen codecs that can save",
  "her people and restore",
  "freedom to the galaxy….",
];

const OpeningCrawl = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<"intro" | "crawl" | "done">("intro");

  useEffect(() => {
    // "A long time ago..." phase
    const introTimer = setTimeout(() => setPhase("crawl"), 3000);
    return () => clearTimeout(introTimer);
  }, []);

  useEffect(() => {
    if (phase === "crawl") {
      const crawlTimer = setTimeout(() => {
        setPhase("done");
        onComplete();
      }, 12000);
      return () => clearTimeout(crawlTimer);
    }
  }, [phase, onComplete]);

  const handleSkip = () => {
    setPhase("done");
    onComplete();
  };

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden cursor-pointer"
          onClick={handleSkip}
        >
          {/* Skip hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-6 right-6 text-xs text-blue-300/50 z-10"
          >
            Click anywhere to skip
          </motion.p>

          {/* Phase 1: "A long time ago..." */}
          <AnimatePresence>
            {phase === "intro" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="text-center"
              >
                <p className="text-[hsl(210,100%,60%)] text-lg sm:text-2xl font-light tracking-wide">
                  A long time ago in a galaxy far,
                </p>
                <p className="text-[hsl(210,100%,60%)] text-lg sm:text-2xl font-light tracking-wide">
                  far away….
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase 2: Scrolling crawl */}
          {phase === "crawl" && (
            <div className="absolute inset-0 flex items-end justify-center" style={{ perspective: "400px" }}>
              {/* Star dots */}
              <div className="absolute inset-0">
                {Array.from({ length: 80 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-[1px] h-[1px] bg-white rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      opacity: Math.random() * 0.7 + 0.3,
                    }}
                  />
                ))}
              </div>

              <motion.div
                initial={{ rotateX: 25, translateY: "100%" }}
                animate={{ rotateX: 25, translateY: "-200%" }}
                transition={{ duration: 12, ease: "linear" }}
                className="text-center max-w-md sm:max-w-lg px-4"
                style={{
                  transformOrigin: "50% 100%",
                  transformStyle: "preserve-3d",
                }}
              >
                {CRAWL_TEXT.map((line, i) => (
                  <p
                    key={i}
                    className={`${
                      i === 0
                        ? "text-xl sm:text-3xl font-bold mb-4"
                        : i === 1
                        ? "text-lg sm:text-2xl font-bold mb-6"
                        : line === ""
                        ? "h-4"
                        : "text-sm sm:text-base mb-1"
                    }`}
                    style={{
                      color: "hsl(45, 100%, 55%)",
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: i < 2 ? 700 : 400,
                    }}
                  >
                    {line || "\u00A0"}
                  </p>
                ))}
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OpeningCrawl;
