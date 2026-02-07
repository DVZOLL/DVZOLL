# DVZOLL — Universal Media Downloader

Download videos and audio from YouTube, Spotify, and 1000+ platforms. Available as a **web app** and a **native desktop app** (macOS, Linux, Windows) powered by [Tauri](https://tauri.app).

---

## 🌐 Web App

The web app is live at **[dvzoll.lovable.app](https://dvzoll.lovable.app)**

---

## 🖥️ Desktop App (v2)

The desktop version bundles real download engines (**yt-dlp**, **spotdl**, **ffmpeg**) so downloads actually work locally on your machine.

### Supported Platforms

| Platform | Status | Setup Script |
|----------|--------|--------------|
| macOS    | ✅ Primary | `scripts/setup-macos.sh` |
| Linux    | ✅ Supported | `scripts/setup-linux.sh` |
| Windows  | ✅ Supported | `scripts/setup-windows.ps1` |

---

## 🚀 Quick Start (macOS — Primary)

### Step 1: Clone the repository

```sh
git clone <YOUR_GIT_URL>
cd dvzoll
```

### Step 2: Run the setup script

This installs **all prerequisites** automatically (Xcode CLT, Homebrew, Rust, Node.js, ffmpeg, yt-dlp, spotdl):

```sh
chmod +x scripts/setup-macos.sh
./scripts/setup-macos.sh
```

### Step 3: Install Node dependencies

```sh
npm install
```

### Step 4: Run in development mode

```sh
npm run tauri dev
```

This launches the app in a native window with hot-reload enabled.

### Step 5: Build for production

```sh
npm run tauri build
```

The `.dmg` installer will be in `src-tauri/target/release/bundle/dmg/`.

---

## 🐧 Linux Setup

### Step 1: Clone & run setup

```sh
git clone <YOUR_GIT_URL>
cd dvzoll
chmod +x scripts/setup-linux.sh
./scripts/setup-linux.sh
```

Supports **apt** (Ubuntu/Debian), **dnf** (Fedora), and **pacman** (Arch).

### Step 2: Build & run

```sh
npm install
npm run tauri dev      # development
npm run tauri build    # production (.deb, .AppImage)
```

---

## 🪟 Windows Setup

### Step 1: Clone & run setup (PowerShell as Administrator)

```powershell
git clone <YOUR_GIT_URL>
cd dvzoll
Set-ExecutionPolicy Bypass -Scope Process
.\scripts\setup-windows.ps1
```

### Step 2: Build & run

```sh
npm install
npm run tauri dev      # development
npm run tauri build    # production (.msi, .exe)
```

### Windows Prerequisites (installed by script)

- **Visual Studio Build Tools 2022** with C++ workload
- **WebView2 Runtime** (usually pre-installed on Windows 10/11)
- **Rust** via rustup
- **Node.js** LTS

---

## 📋 Prerequisites Summary

| Tool | Purpose | Install Method |
|------|---------|----------------|
| **Rust** | Tauri backend compilation | `rustup` |
| **Node.js** | Frontend build toolchain | `nvm` / `brew` / `winget` |
| **ffmpeg** | Audio/video processing | `brew` / `apt` / `winget` |
| **yt-dlp** | YouTube & 1000+ site downloads | `brew` / `pip` / `winget` |
| **spotdl** | Spotify track downloads | `pip3 install spotdl` |
| **Python 3** | Required by spotdl | `brew` / `apt` / `winget` |

---

## 🏗️ Project Structure

```
dvzoll/
├── src/                    # React frontend (shared web + desktop)
│   ├── components/         # UI components
│   ├── pages/              # Page routes
│   ├── hooks/              # Custom React hooks
│   └── assets/             # Images, logos
├── src-tauri/              # Tauri/Rust backend (desktop only)
│   ├── src/
│   │   ├── main.rs         # App entry point & command registration
│   │   ├── downloader.rs   # yt-dlp & spotdl integration
│   │   └── prerequisites.rs# Auto-install tools at runtime
│   ├── Cargo.toml          # Rust dependencies
│   └── tauri.conf.json     # Tauri configuration
├── scripts/                # Platform setup scripts
│   ├── setup-macos.sh
│   ├── setup-linux.sh
│   └── setup-windows.ps1
├── public/                 # Static assets
└── package.json            # Node dependencies
```

---

## ⚙️ How It Works

The desktop app wraps the same React UI in a native window via Tauri. When a download is triggered:

1. **Frontend** sends the URL, quality, and mode to the Rust backend via Tauri commands
2. **Rust backend** spawns `yt-dlp` or `spotdl` as a child process with the correct arguments
3. **Files are saved** to `~/Downloads/DVZOLL/`
4. **Progress & status** are reported back to the frontend

### Download Engines

- **yt-dlp** → YouTube, Vimeo, Twitter, TikTok, and 1000+ sites
- **spotdl** → Spotify tracks, albums, and playlists
- **ffmpeg** → Audio extraction, format conversion, video merging

### Quality Options

| Mode | Options |
|------|---------|
| Video | 4K (2160p), 2K (1440p), 1080p, 720p |
| Audio | FLAC, WAV, AAC, MP3 320kbps |

---

## 🔧 Development

```sh
# Web app only (no Tauri)
npm run dev

# Desktop app (Tauri + web)
npm run tauri dev

# Build desktop app
npm run tauri build
```

---

## 📝 Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion
- **Desktop**: Tauri (Rust), tokio (async process management)
- **Download**: yt-dlp, spotdl, ffmpeg
- **Backend (web)**: Lovable Cloud

---

## ⚠️ Disclaimer

For educational purposes only. Respect copyright laws and platform terms of service.
