#!/bin/bash
# ============================================
# DVZOLL — macOS Setup Script
# Installs all prerequisites for building
# and running the DVZOLL desktop app.
# ============================================

set -e

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║    DVZOLL — macOS Development Setup      ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Colors
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

# 1. Xcode Command Line Tools
echo "── Step 1: Xcode Command Line Tools ──"
if xcode-select -p &> /dev/null; then
  echo -e "${GREEN}✅ Xcode CLT already installed${NC}"
else
  echo -e "${YELLOW}Installing Xcode Command Line Tools...${NC}"
  xcode-select --install
  echo "Please complete the installation dialog, then re-run this script."
  exit 1
fi
echo ""

# 2. Homebrew
echo "── Step 2: Homebrew ──"
if ! check brew; then
  echo -e "${YELLOW}Installing Homebrew...${NC}"
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi
echo ""

# 3. Rust toolchain
echo "── Step 3: Rust Toolchain ──"
if ! check rustc; then
  echo -e "${YELLOW}Installing Rust via rustup...${NC}"
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
  source "$HOME/.cargo/env"
fi
echo "  Rust version: $(rustc --version)"
echo ""

# 4. Node.js
echo "── Step 4: Node.js ──"
if ! check node; then
  echo -e "${YELLOW}Installing Node.js via Homebrew...${NC}"
  brew install node
fi
echo "  Node version: $(node --version)"
echo ""

# 5. Download tools
echo "── Step 5: Download Tools ──"

# ffmpeg
if ! check ffmpeg; then
  echo -e "${YELLOW}Installing ffmpeg...${NC}"
  brew install ffmpeg
fi

# yt-dlp
if ! check yt-dlp; then
  echo -e "${YELLOW}Installing yt-dlp...${NC}"
  brew install yt-dlp
fi

# Python3 (needed for spotdl)
if ! check python3; then
  echo -e "${YELLOW}Installing Python 3...${NC}"
  brew install python3
fi

# pipx (needed for spotdl)
if ! check pipx; then
  echo -e "${YELLOW}Installing pipx...${NC}"
  brew install pipx
  pipx ensurepath
fi

# spotdl
if ! check spotdl; then
  echo -e "${YELLOW}Installing spotdl via pipx...${NC}"
  pipx install spotdl
fi
echo ""

# 6. Summary
echo "╔══════════════════════════════════════════╗"
echo "║         Setup Complete! Summary:         ║"
echo "╠══════════════════════════════════════════╣"
echo -n "║  "
check rustc > /dev/null 2>&1 && echo -e "${GREEN}✅ Rust${NC}" || echo -e "${RED}❌ Rust${NC}"
echo -n "║  "
check node > /dev/null 2>&1 && echo -e "${GREEN}✅ Node.js${NC}" || echo -e "${RED}❌ Node.js${NC}"
echo -n "║  "
check ffmpeg > /dev/null 2>&1 && echo -e "${GREEN}✅ ffmpeg${NC}" || echo -e "${RED}❌ ffmpeg${NC}"
echo -n "║  "
check yt-dlp > /dev/null 2>&1 && echo -e "${GREEN}✅ yt-dlp${NC}" || echo -e "${RED}❌ yt-dlp${NC}"
echo -n "║  "
check spotdl > /dev/null 2>&1 && echo -e "${GREEN}✅ spotdl${NC}" || echo -e "${RED}❌ spotdl${NC}"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "🚀 Next steps:"
echo "   cd dvzoll"
echo "   npm install"
echo "   npm run tauri dev"
echo ""
