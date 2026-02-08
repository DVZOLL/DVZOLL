<div align="center">
  <img src="src/assets/logo.png" alt="DVZOLL" width="80" height="80" style="border-radius: 16px;" />
  <h1>DVZOLL</h1>
  <p><strong>Grab any media. Instantly.</strong></p>
  <p>Download video & audio from YouTube, Spotify, and 1000+ platforms.<br/>Maximum quality. Zero hassle. Zero sketchy ads.</p>

  <br/>

  <a href="https://dvzoll.lovable.app"><img src="https://img.shields.io/badge/🌐_Live_Demo-dvzoll.lovable.app-00ff88?style=for-the-badge" alt="Live Demo" /></a>
  <img src="https://img.shields.io/badge/platforms-macOS_·_Linux_·_Windows-1a1a2e?style=for-the-badge" alt="Platforms" />
  <img src="https://img.shields.io/badge/engines-yt--dlp_·_spotdl_·_ffmpeg-1a1a2e?style=for-the-badge" alt="Engines" />

  <br/><br/>

  <img src="https://media.giphy.com/media/HUplkVCPY7jTW/giphy.gif" alt="downloading intensifies" width="400" />

  <p><em>^ actual footage of DVZOLL users</em></p>

</div>

---

## ⚡ What is DVZOLL?

You know those download sites where you click "Download" and suddenly you're married to three toolbars and a crypto miner? **DVZOLL is the opposite of that.**

It's a native desktop app powered by [Tauri](https://tauri.app) that downloads media for real — 4K video, FLAC audio, entire playlists — using battle-tested engines like **yt-dlp**, **spotdl**, and **ffmpeg** under the hood. No browser. No ads. No nonsense.

Want to try it before committing? The **[live demo](https://dvzoll.lovable.app)** simulates the full experience in your browser — same UI, same vibes, just without the actual file downloads.

### What you don't get

| ❌ What you don't get |
|---|
| 240p filmed-on-a-toaster quality |
| Washing machine audio™ |
| 47 fake "Download" buttons |
| "Converting... 99%... forever" |
| Surprise browser extensions |
| Trojan horses disguised as `.mp3` files |

---

## 🚀 Quick Start

### Web — Just vibe-check it

> **[dvzoll.lovable.app](https://dvzoll.lovable.app)** — no install, no commitment, no judgment.

### Desktop — Three commands, one coffee ☕

```sh
git clone https://github.com/DVZOLL/DVZOLL.git && cd DVZOLL
chmod +x scripts/setup-macos.sh && ./scripts/setup-macos.sh
npm install && npm run tauri dev
```

That's it. The setup script handles Rust, Node, ffmpeg, yt-dlp, and spotdl automatically. Go grab a coffee while Rust compiles — you've earned it.

<details>
<summary><strong>🐧 Linux</strong></summary>

```sh
chmod +x scripts/setup-linux.sh && ./scripts/setup-linux.sh
npm install && npm run tauri dev
```
Supports `apt` (Ubuntu/Debian), `dnf` (Fedora), and `pacman` (Arch). We don't discriminate.
</details>

<details>
<summary><strong>🪟 Windows</strong></summary>

```powershell
Set-ExecutionPolicy Bypass -Scope Process
.\scripts\setup-windows.ps1
npm install && npm run tauri dev
```
Requires Visual Studio Build Tools with C++ workload and WebView2 (usually pre-installed on Win 10/11).
</details>

---

## 🎛️ Features

| Feature | Details |
|---|---|
| 🔍 **Smart URL detection** | Auto-identifies YouTube, Spotify, TikTok, Vimeo, Twitter, and more |
| 🎬 **Video + Audio modes** | Video (4K → 720p) or Audio (FLAC, WAV, AAC, MP3 320) — we're not savages |
| 📋 **Playlist downloads** | Grab entire playlists with per-track progress bars |
| 📊 **Multi-phase progress** | Fetching → Downloading → Converting → Done. No mystery spinners. |
| ⚙️ **Settings panel** | Configure download path, concurrent downloads, tool locations |
| 🎨 **3 color themes** | Cyber Green · Neon Purple · Sunset Orange |
| 🥚 **Easter eggs** | Konami code, secret terminal, rick-roll detection... you'll find them |

<div align="center">
  <br/>
  <img src="https://media.giphy.com/media/l4FGni1RBAR2OWsGk/giphy.gif" alt="audiophile moment" width="350" />
  <p><em>DVZOLL users when they hear FLAC for the first time</em></p>
  <br/>
</div>

---

## 🏗️ Architecture

```
dvzoll/
├── src/                     # React frontend (web + desktop)
│   ├── components/          # UI — DownloadCard, UrlPreview, QualitySelector...
│   ├── pages/               # Index, Settings, DevTerminal
│   └── hooks/               # useConfetti, useKonamiCode, useThemeContext
├── src-tauri/               # Tauri/Rust backend (desktop only)
│   └── src/
│       ├── main.rs          # Command registration
│       ├── downloader.rs    # yt-dlp & spotdl process spawning
│       └── prerequisites.rs # Auto-install via Homebrew/apt/winget
├── scripts/                 # One-click setup per platform
│   ├── setup-macos.sh
│   ├── setup-linux.sh
│   └── setup-windows.ps1
└── public/                  # Static assets & favicon
```

---

## 📋 Prerequisites

> All auto-installed by the setup scripts. Sit back and relax.

| Tool | Purpose | Auto-installed |
|------|---------|:---:|
| Rust | Tauri compilation (the coffee break part) | ✅ |
| Node.js | Frontend toolchain | ✅ |
| ffmpeg | Media processing wizard | ✅ |
| yt-dlp | YouTube + 1000 sites | ✅ |
| spotdl | Spotify downloads | ✅ |
| Python 3 | spotdl dependency | ✅ |

---

## ❓ Troubleshooting

| Error | Fix |
|-------|-----|
| `fatal: destination path 'dvzoll' already exists` | Delete and re-clone: `rm -rf dvzoll && git clone ...` — or just `cd dvzoll && git pull` |
| `Could not read package.json` / `ENOENT` | You're in the wrong directory. Run `cd dvzoll` first. |
| `chmod: scripts/setup-macos.sh: No such file or directory` | Same as above — `cd` into the project folder before running scripts. |
| `error: failed to run custom build command for ...` | Ensure Rust is installed: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \| sh` |
| `yt-dlp: command not found` | Run the setup script again, or install manually: `brew install yt-dlp` (macOS) / `pip install yt-dlp` |
| `ffmpeg: command not found` | `brew install ffmpeg` (macOS) / `sudo apt install ffmpeg` (Linux) |
| `npm ERR! ERESOLVE` | Try `npm install --legacy-peer-deps` |
| WebView2 missing (Windows) | Download from [developer.microsoft.com/en-us/microsoft-edge/webview2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) |

> **Still stuck?** Open an [issue](https://github.com/DVZOLL/DVZOLL/issues) with your terminal output. We don't bite.

---

## 🔧 Development

```sh
npm run dev              # web only (no Tauri)
npm run tauri dev        # desktop with hot-reload
npm run tauri build      # production build (.dmg / .deb / .msi)
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React · TypeScript · Vite · Tailwind CSS · shadcn/ui · Framer Motion |
| **Desktop** | Tauri · Rust · tokio |
| **Engines** | yt-dlp · spotdl · ffmpeg |

---

<div align="center">

  <img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" alt="mic drop" width="250" />

  <br/><br/>

  <sub>Built with obsession by <strong>DvIsZoll</strong> — because every other download site was sketch.</sub>
  <br/>
  <sub>⚠️ For educational purposes only. Respect copyright and platform terms of service.</sub>

  <br/><br/>

  <a href="https://github.com/DVZOLL/DVZOLL">⭐ Star this repo if DVZOLL saved you from a sketchy download site. Your ego feeds ours.</a>

</div>
