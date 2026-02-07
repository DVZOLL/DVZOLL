# ============================================
# DVZOLL — Windows Setup Script (PowerShell)
# Run as Administrator:
#   Set-ExecutionPolicy Bypass -Scope Process
#   .\scripts\setup-windows.ps1
# ============================================

Write-Host ""
Write-Host "========================================"
Write-Host "  DVZOLL — Windows Development Setup"
Write-Host "========================================"
Write-Host ""

function Check-Command($name) {
    return [bool](Get-Command $name -ErrorAction SilentlyContinue)
}

# 1. Check for winget
if (-not (Check-Command winget)) {
    Write-Host "❌ winget not found. Please install App Installer from the Microsoft Store." -ForegroundColor Red
    exit 1
}

# 2. Visual Studio Build Tools (C++ workload)
Write-Host "── Step 1: Visual Studio Build Tools ──"
Write-Host "Tauri requires MSVC C++ build tools."
Write-Host "If not installed, run: winget install Microsoft.VisualStudio.2022.BuildTools"
Write-Host "  Then add 'Desktop development with C++' workload."
Write-Host ""

# 3. Rust
Write-Host "── Step 2: Rust Toolchain ──"
if (Check-Command rustc) {
    Write-Host "✅ Rust is installed: $(rustc --version)" -ForegroundColor Green
} else {
    Write-Host "Installing Rust..." -ForegroundColor Yellow
    winget install Rustlang.Rustup
    Write-Host "Please restart your terminal and re-run this script." -ForegroundColor Yellow
    exit 0
}

# 4. Node.js
Write-Host "── Step 3: Node.js ──"
if (Check-Command node) {
    Write-Host "✅ Node.js: $(node --version)" -ForegroundColor Green
} else {
    Write-Host "Installing Node.js..." -ForegroundColor Yellow
    winget install OpenJS.NodeJS.LTS
}

# 5. WebView2 (usually pre-installed on Windows 10/11)
Write-Host "── Step 4: WebView2 Runtime ──"
$wv2 = Get-ItemProperty "HKLM:\SOFTWARE\WOW6432Node\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}" -ErrorAction SilentlyContinue
if ($wv2) {
    Write-Host "✅ WebView2 is installed" -ForegroundColor Green
} else {
    Write-Host "Installing WebView2..." -ForegroundColor Yellow
    winget install Microsoft.EdgeWebView2Runtime
}

# 6. Download tools
Write-Host ""
Write-Host "── Step 5: Download Tools ──"

# ffmpeg
if (Check-Command ffmpeg) {
    Write-Host "✅ ffmpeg installed" -ForegroundColor Green
} else {
    Write-Host "Installing ffmpeg..." -ForegroundColor Yellow
    winget install Gyan.FFmpeg
}

# yt-dlp
if (Check-Command yt-dlp) {
    Write-Host "✅ yt-dlp installed" -ForegroundColor Green
} else {
    Write-Host "Installing yt-dlp..." -ForegroundColor Yellow
    winget install yt-dlp.yt-dlp
}

# Python + spotdl
if (Check-Command python) {
    Write-Host "✅ Python installed" -ForegroundColor Green
} else {
    Write-Host "Installing Python..." -ForegroundColor Yellow
    winget install Python.Python.3.12
}

if (Check-Command spotdl) {
    Write-Host "✅ spotdl installed" -ForegroundColor Green
} else {
    Write-Host "Installing spotdl..." -ForegroundColor Yellow
    pip install spotdl
}

Write-Host ""
Write-Host "========================================"
Write-Host "  Setup Complete!"
Write-Host "========================================"
Write-Host ""
Write-Host "Next steps:"
Write-Host "   cd dvzoll"
Write-Host "   npm install"
Write-Host "   npm run tauri dev"
Write-Host ""
