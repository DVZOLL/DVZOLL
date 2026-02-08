<div align="center">
  <img src="src/assets/logo.png" alt="DVZOLL" width="80" height="80" style="border-radius: 16px;" />
  <h1>DVZOLL</h1>
  <p><strong>Grab any media. Instantly.</strong></p>
  <p>Download video & audio from YouTube, Spotify, and 1000+ platforms.<br/>Maximum quality. Zero hassle.</p>

  <br/>

  <a href="https://dvzoll.lovable.app"><img src="https://img.shields.io/badge/🌐_Live_App-dvzoll.lovable.app-00ff88?style=for-the-badge" alt="Live App" /></a>
  <img src="https://img.shields.io/badge/platforms-macOS_·_Linux_·_Windows-1a1a2e?style=for-the-badge" alt="Platforms" />
  <img src="https://img.shields.io/badge/engines-yt--dlp_·_spotdl_·_ffmpeg-1a1a2e?style=for-the-badge" alt="Engines" />

</div>

---

## ⚡ What is DVZOLL?

A universal media downloader that actually works — available as a **web app** and a **native desktop app** powered by [Tauri](https://tauri.app).

| | Web App | Desktop App |
|---|---|---|
| **Downloads** | Simulated (demo) | Real — powered by yt-dlp & spotdl |
| **Platforms** | Any browser | macOS · Linux · Windows |
| **Quality** | 4K / FLAC / WAV / MP3 320 | 4K / FLAC / WAV / MP3 320 |
| **Playlists** | ✅ | ✅ |

---

## 🚀 Quick Start

### Web — Just visit

> **[dvzoll.lovable.app](https://dvzoll.lovable.app)**

### Desktop — Three commands

```sh
git clone https://github.com/DvIsZoll/dvzoll.git && cd dvzoll
chmod +x scripts/setup-macos.sh && ./scripts/setup-macos.sh   # installs everything
npm install && npm run tauri dev
```

That's it. The setup script handles Rust, Node, ffmpeg, yt-dlp, and spotdl automatically.

<details>
<summary><strong>🐧 Linux</strong></summary>

```sh
chmod +x scripts/setup-linux.sh && ./scripts/setup-linux.sh
npm install && npm run tauri dev
```
Supports `apt` (Ubuntu/Debian), `dnf` (Fedora), and `pacman` (Arch).
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

- **Smart URL detection** — auto-identifies YouTube, Spotify, TikTok, Vimeo, Twitter, and more
- **Video + Audio modes** — switch between video (4K → 720p) and audio (FLAC, WAV, AAC, MP3 320)
- **Playlist downloads** — grab entire playlists with per-track progress
- **Multi-phase progress** — fetching → downloading → converting → done
- **Settings panel** — configure download path, concurrent downloads, tool locations
- **3 color themes** — Cyber Green, Neon Purple, Sunset Orange
- **Easter eggs** — Konami code, terminal, rick-roll detection 🥚

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

| Tool | Purpose | Auto-installed by setup script |
|------|---------|:---:|
| Rust | Tauri compilation | ✅ |
| Node.js | Frontend toolchain | ✅ |
| ffmpeg | Media processing | ✅ |
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

> **Still stuck?** Open an [issue](https://github.com/DvIsZoll/dvzoll/issues) with your terminal output.

---

## 🔧 Development

```sh
npm run dev              # web only (no Tauri)
npm run tauri dev        # desktop with hot-reload
npm run tauri build      # production build (.dmg / .deb / .msi)
```

---

## 🛠️ Tech Stack

**Frontend** — React · TypeScript · Vite · Tailwind CSS · shadcn/ui · Framer Motion
**Desktop** — Tauri · Rust · tokio
**Engines** — yt-dlp · spotdl · ffmpeg

---

<div align="center">
  <sub>Built with obsession by <strong>DvIsZoll</strong> — because every other download site was sketch.</sub>
  <br/>
  <sub>⚠️ For educational purposes only. Respect copyright and platform terms of service.</sub>
</div>
