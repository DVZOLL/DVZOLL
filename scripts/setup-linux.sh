#!/bin/bash
# ============================================
# DVZOLL — Linux Setup Script
# Installs all prerequisites for building
# and running the DVZOLL desktop app.
# ============================================

set -e

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║    DVZOLL — Linux Development Setup      ║"
echo "╚══════════════════════════════════════════╝"
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

check() {
  if command -v "$1" &> /dev/null; then
    echo -e "${GREEN}✅ $1 is installed${NC}"
    return 0
  else
    echo -e "${RED}❌ $1 is not installed${NC}"
    return 1
  fi
}

# Detect package manager
if command -v apt-get &> /dev/null; then
  PKG="apt"
elif command -v dnf &> /dev/null; then
  PKG="dnf"
elif command -v pacman &> /dev/null; then
  PKG="pacman"
else
  echo -e "${RED}Unsupported package manager. Install dependencies manually.${NC}"
  exit 1
fi

# 1. System dependencies for Tauri
echo "── Step 1: System Dependencies (Tauri) ──"
if [ "$PKG" = "apt" ]; then
  sudo apt-get update
  sudo apt-get install -y libwebkit2gtk-4.0-dev build-essential curl wget file \
    libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev
elif [ "$PKG" = "dnf" ]; then
  sudo dnf install -y webkit2gtk4.0-devel openssl-devel curl wget file \
    libappindicator-gtk3-devel librsvg2-devel gcc-c++
elif [ "$PKG" = "pacman" ]; then
  sudo pacman -Syu --noconfirm webkit2gtk base-devel curl wget file \
    openssl appmenu-gtk-module gtk3 libappindicator-gtk3 librsvg
fi
echo ""

# 2. Rust
echo "── Step 2: Rust Toolchain ──"
if ! check rustc; then
  echo -e "${YELLOW}Installing Rust...${NC}"
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
  source "$HOME/.cargo/env"
fi
echo "  Rust: $(rustc --version)"
echo ""

# 3. Node.js
echo "── Step 3: Node.js ──"
if ! check node; then
  echo -e "${YELLOW}Installing Node.js via nvm...${NC}"
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  nvm install --lts
fi
echo "  Node: $(node --version)"
echo ""

# 4. Download tools
echo "── Step 4: Download Tools ──"

# ffmpeg
if ! check ffmpeg; then
  echo -e "${YELLOW}Installing ffmpeg...${NC}"
  if [ "$PKG" = "apt" ]; then sudo apt-get install -y ffmpeg;
  elif [ "$PKG" = "dnf" ]; then sudo dnf install -y ffmpeg;
  elif [ "$PKG" = "pacman" ]; then sudo pacman -S --noconfirm ffmpeg;
  fi
fi

# yt-dlp
if ! check yt-dlp; then
  echo -e "${YELLOW}Installing yt-dlp...${NC}"
  pip3 install yt-dlp || sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && sudo chmod a+rx /usr/local/bin/yt-dlp
fi

# spotdl
if ! check spotdl; then
  echo -e "${YELLOW}Installing spotdl...${NC}"
  pip3 install spotdl
fi
echo ""

echo "╔══════════════════════════════════════════╗"
echo "║          Setup Complete!                 ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "🚀 Next steps:"
echo "   cd dvzoll"
echo "   npm install"
echo "   npm run tauri dev"
echo ""
