import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ASCII_LOGO = `
 ██████╗ ██╗   ██╗███████╗ ██████╗ ██╗     ██╗     
 ██╔══██╗██║   ██║╚══███╔╝██╔═══██╗██║     ██║     
 ██║  ██║██║   ██║  ███╔╝ ██║   ██║██║     ██║     
 ██║  ██║╚██╗ ██╔╝ ███╔╝  ██║   ██║██║     ██║     
 ██████╔╝ ╚████╔╝ ███████╗╚██████╔╝███████╗███████╗
 ╚═════╝   ╚═══╝  ╚══════╝ ╚═════╝ ╚══════╝╚══════╝
`;

interface StatLine {
  label: string;
  value: string;
  bar?: number; // 0-100
}

const STATS: StatLine[] = [
  { label: "CPU USAGE", value: "23%", bar: 23 },
  { label: "MEMORY", value: "1.4 GB / 8 GB", bar: 17 },
  { label: "DOWNLOADS TODAY", value: "1,337" },
  { label: "ACTIVE SESSIONS", value: "42" },
  { label: "UPTIME", value: "99.97%" },
  { label: "THREATS BLOCKED", value: "∞" },
  { label: "RICKROLLS DETECTED", value: "7" },
  { label: "COFFEE CONSUMED", value: "☕☕☕☕☕" },
];

const BOOT_LINES = [
  "DVZOLL SYSTEM v2.0.26",
  "═══════════════════════════════════════",
  "Initializing kernel modules...",
  "[OK] yt-dlp engine v2026.02",
  "[OK] spotdl bridge v4.2.7",
  "[OK] librespot daemon active",
  "[OK] Anti-popup shield enabled",
  "[OK] Virus scanner: nothing to scan (we're clean)",
  "[OK] Meme database loaded (420 entries)",
  "═══════════════════════════════════════",
  "System ready. Welcome, hacker.",
  "",
];

const COMMANDS: Record<string, string[]> = {
  help: [
    "Available commands:",
    "  help     — show this message",
    "  stats    — system statistics",
    "  clear    — clear terminal",
    "  whoami   — who are you?",
    "  fortune  — get a fortune",
    "  exit     — return home",
  ],
  whoami: ["You are: curious_user_01", "Access level: EASTER_EGG_HUNTER", "Status: Awesome 🔥"],
  fortune: [
    "🔮 " + [
      "The bug you're looking for is on line 42.",
      "Your next commit will break nothing. (Just kidding.)",
      "A mass of downloading awaits you.",
      "The CSS will center itself when you least expect it.",
      "You will find another easter egg soon...",
    ][Math.floor(Math.random() * 5)],
  ],
  stats: STATS.map((s) => `  ${s.label.padEnd(22)} ${s.value}`),
};

const DevTerminal = () => {
  const [lines, setLines] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [bootDone, setBootDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Boot sequence
  useEffect(() => {
    const timers = BOOT_LINES.map((line, i) =>
      setTimeout(() => {
        setLines((prev) => [...prev, line]);
        if (i === BOOT_LINES.length - 1) setBootDone(true);
      }, i * 150)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  useEffect(() => {
    if (bootDone) inputRef.current?.focus();
  }, [bootDone]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    setLines((prev) => [...prev, `$ ${cmd}`]);

    if (trimmed === "clear") {
      setLines([]);
    } else if (trimmed === "exit") {
      navigate("/");
    } else if (COMMANDS[trimmed]) {
      // Re-roll fortune each time
      if (trimmed === "fortune") {
        const fortunes = [
          "The bug you're looking for is on line 42.",
          "Your next commit will break nothing. (Just kidding.)",
          "A mass of downloading awaits you.",
          "The CSS will center itself when you least expect it.",
          "You will find another easter egg soon...",
        ];
        setLines((prev) => [...prev, "🔮 " + fortunes[Math.floor(Math.random() * fortunes.length)]]);
      } else {
        setLines((prev) => [...prev, ...COMMANDS[trimmed]]);
      }
    } else if (trimmed) {
      setLines((prev) => [...prev, `command not found: ${trimmed}. Type 'help' for commands.`]);
    }
    setInput("");
  };

  return (
    <div
      className="min-h-screen bg-background flex items-center justify-center p-4"
      onClick={() => inputRef.current?.focus()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-3xl bg-card border border-primary/30 rounded-xl overflow-hidden box-glow"
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-secondary/50">
          <div className="flex gap-1.5">
            <button
              onClick={() => navigate("/")}
              className="w-3 h-3 rounded-full bg-destructive hover:brightness-125 transition"
            />
            <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
            <div className="w-3 h-3 rounded-full bg-primary/40" />
          </div>
          <span className="text-xs text-muted-foreground font-mono ml-2">
            dvzoll@system ~ /dev
          </span>
        </div>

        {/* Terminal body */}
        <div className="p-4 md:p-6 font-mono text-sm min-h-[500px] max-h-[80vh] overflow-y-auto">
          {/* ASCII Art */}
          <pre className="text-primary text-glow text-[8px] sm:text-[10px] md:text-xs leading-tight mb-4 select-none">
            {ASCII_LOGO}
          </pre>

          {/* Lines */}
          {lines.map((line, i) => (
            <p
              key={i}
              className={
                line.startsWith("[OK]")
                  ? "text-primary"
                  : line.startsWith("$")
                  ? "text-foreground font-semibold"
                  : line.startsWith("═")
                  ? "text-primary/40"
                  : line.startsWith("  ")
                  ? "text-muted-foreground"
                  : "text-foreground/70"
              }
            >
              {line}
            </p>
          ))}

          {/* Stats bars (shown after boot) */}
          {bootDone && lines.length === BOOT_LINES.length && (
            <div className="mt-4 space-y-2">
              {STATS.filter((s) => s.bar !== undefined).map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{s.label}</span>
                    <span className="text-primary">{s.value}</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full mt-1 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.bar}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Input */}
          {bootDone && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-primary">$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCommand(input);
                }}
                className="flex-1 bg-transparent text-foreground outline-none font-mono text-sm caret-primary"
                autoFocus
                spellCheck={false}
              />
              <span className="w-2 h-4 bg-primary animate-pulse" />
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </motion.div>
    </div>
  );
};

export default DevTerminal;
