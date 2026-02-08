<div align="center">
  <img src="src/assets/logo.png" alt="DVZOLL" width="80" height="80" style="border-radius: 16px;" />
  <h1>DVZOLL</h1>
  <p><strong>Grab any media. Instantly.</strong></p>
  <p>Download video & audio from YouTube, Spotify, and 1000+ platforms.<br/>Maximum quality. Zero hassle.</p>

  <br/>

  <a href="https://dvzoll.lovable.app"><img src="https://img.shields.io/badge/🌐_Live_Demo-dvzoll.lovable.app-00ff88?style=for-the-badge" alt="Live Demo" /></a>
  <img src="https://img.shields.io/badge/platforms-macOS_·_Linux_·_Windows-1a1a2e?style=for-the-badge" alt="Platforms" />
  <img src="https://img.shields.io/badge/engines-yt--dlp_·_spotdl_·_ffmpeg-1a1a2e?style=for-the-badge" alt="Engines" />

  <br/><br/>

  <img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjFtMzFoZWd5ZXp2c3BkMjlsOXdwZXJzbWpkcG5kY2cxdXVjcWtkYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7btNhMBytxAM6YBa/giphy.gif" width="300" alt="downloading intensifies" />

</div>

---

## ⚡ What is DVZOLL?

A **native desktop app** that downloads media from the internet — the way it should've always worked.

No sketchy sites. No fake "Download" buttons. No `totally_not_a_virus.mp3.exe`.

Just paste a URL, pick your quality, and go. That's it. That's the app.

> 🎮 **Want to see it in action?** Check the [interactive demo](https://dvzoll.lovable.app) — it's a simulated preview so you can explore the UI before installing.

<table>
<tr>
<td width="50%">

### 🎬 What you get
- **Real downloads** — yt-dlp & spotdl under the hood
- **4K video** or **lossless FLAC audio** — your call
- **Full playlist support** with per-track progress
- **macOS · Linux · Windows** — one codebase, all platforms

</td>
<td width="50%">

### 🚫 What you don't get
- Pop-up ads asking if you've won an iPhone
- Files that are actually trojans wearing a `.mp3` costume
- Audio that sounds like it was recorded inside a washing machine
- That one "Download" button that's actually an ad

</td>
</tr>
</table>

---

## 🚀 Quick Start

### Desktop — Three commands

```sh
git clone https://github.com/DVZOLL/DVZOLL.git && cd DVZOLL
chmod +x scripts/setup-macos.sh && ./scripts/setup-macos.sh   # installs everything
npm install && npm run tauri dev
```

That's it. The setup script handles Rust, Node, ffmpeg, yt-dlp, and spotdl automatically.

> ☕ Go grab a coffee while it compiles. Rust takes a minute the first time. Worth it though.

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

| Feature | Details |
|---------|---------|
| 🔗 **Smart URL detection** | Auto-identifies YouTube, Spotify, TikTok, Vimeo, Twitter, and more |
| 🎬 **Video + Audio modes** | Video (4K → 720p) · Audio (FLAC, WAV, AAC, MP3 320) |
| 📋 **Playlist downloads** | Grab entire playlists with per-track progress |
| 📊 **Multi-phase progress** | Fetching → Downloading → Converting → Done |
| ⚙️ **Settings panel** | Default quality presets, download path, concurrent downloads, tool status |
| 🎨 **3 color themes** | Cyber Green · Neon Purple · Sunset Orange |
| ✨ **Buttery smooth UI** | GPU-accelerated animations with native-feel scrolling |
| 🥚 **Easter eggs** | Konami code, secret terminal, rick-roll detection |

<div align="center">
  <img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWRwNXh5OGdhOXNkenJ4NWRpMGwzNjU2ZmVkZjJiemZ2NW1lMjVzaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlNaQ6gWfllcjDO/giphy.gif" width="250" alt="quality matters" />
  <br/>
  <sub><em>"When the FLAC hits different" — every audiophile ever</em></sub>
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

| Tool | Purpose | Auto-installed by setup script |
|------|---------|:---:|
| Rust | Tauri compilation | ✅ |
| Node.js | Frontend toolchain | ✅ |
| ffmpeg | Media processing | ✅ |
| yt-dlp | YouTube + 1000 sites | ✅ |
| spotdl | Spotify downloads | ✅ |
| Python 3 | spotdl dependency | ✅ |

> Don't worry about installing these manually — the setup scripts do everything. We're not savages.

---

## 🔧 Development

```sh
npm run dev              # web only (no Tauri)
npm run tauri dev        # desktop with hot-reload
npm run tauri build      # production build (.dmg / .deb / .msi)
```

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| **Frontend** | React · TypeScript · Vite · Tailwind CSS · shadcn/ui · Framer Motion |
| **Desktop** | Tauri · Rust · tokio |
| **Engines** | yt-dlp · spotdl · ffmpeg |

---

<div align="center">

  <img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2V4YWRncjlhbm1yd2NjeGN1dW9sZXc2YXF1aXRrN3VoaTY2b3BxZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26BRuo6sLetdllPAQ/giphy.gif" width="200" alt="built different" />

  <br/><br/>

  Built with obsession by **DvIsZoll** — because every other download site was sketch.

  ⚠️ *For educational purposes only. Respect copyright and platform terms of service.*

  <br/>

  <sub>If this saved you from a sketchy download site, consider ⭐ starring the repo. It feeds the developer's ego.</sub>

</div>
