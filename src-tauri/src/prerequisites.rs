use serde::Serialize;
use tauri::command;
use tokio::process::Command;

#[derive(Debug, Serialize)]
pub struct InstallResult {
    pub success: bool,
    pub message: String,
    pub yt_dlp: bool,
    pub spotdl: bool,
    pub ffmpeg: bool,
}

/// Attempts to install all prerequisites via Homebrew (macOS) or provides instructions.
#[command]
pub async fn install_prerequisites() -> InstallResult {
    let mut messages: Vec<String> = Vec::new();
    let mut yt_dlp_ok = false;
    let mut spotdl_ok = false;
    let mut ffmpeg_ok = false;

    // Check if Homebrew is available (macOS)
    let brew_available = Command::new("brew").arg("--version").output().await.is_ok();

    if !brew_available {
        return InstallResult {
            success: false,
            message: "Homebrew is not installed. Please install it first:\n\n/bin/bash -c \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\"\n\nThen re-run this setup.".to_string(),
            yt_dlp: false,
            spotdl: false,
            ffmpeg: false,
        };
    }

    // Install ffmpeg
    let ffmpeg_check = Command::new("ffmpeg").arg("-version").output().await;
    if ffmpeg_check.is_ok() {
        ffmpeg_ok = true;
        messages.push("✅ ffmpeg already installed".to_string());
    } else {
        let result = Command::new("brew")
            .args(["install", "ffmpeg"])
            .output()
            .await;
        match result {
            Ok(r) if r.status.success() => {
                ffmpeg_ok = true;
                messages.push("✅ ffmpeg installed successfully".to_string());
            }
            _ => messages.push("❌ Failed to install ffmpeg via brew".to_string()),
        }
    }

    // Install yt-dlp
    let ytdlp_check = Command::new("yt-dlp").arg("--version").output().await;
    if ytdlp_check.is_ok() {
        yt_dlp_ok = true;
        messages.push("✅ yt-dlp already installed".to_string());
    } else {
        let result = Command::new("brew")
            .args(["install", "yt-dlp"])
            .output()
            .await;
        match result {
            Ok(r) if r.status.success() => {
                yt_dlp_ok = true;
                messages.push("✅ yt-dlp installed successfully".to_string());
            }
            _ => messages.push("❌ Failed to install yt-dlp via brew".to_string()),
        }
    }

    // Install spotdl via pip
    let spotdl_check = Command::new("spotdl").arg("--version").output().await;
    if spotdl_check.is_ok() {
        spotdl_ok = true;
        messages.push("✅ spotdl already installed".to_string());
    } else {
        // Try pip3 first
        let result = Command::new("pip3")
            .args(["install", "spotdl"])
            .output()
            .await;
        match result {
            Ok(r) if r.status.success() => {
                spotdl_ok = true;
                messages.push("✅ spotdl installed successfully via pip3".to_string());
            }
            _ => {
                // Try pipx as fallback
                let result2 = Command::new("pipx")
                    .args(["install", "spotdl"])
                    .output()
                    .await;
                match result2 {
                    Ok(r) if r.status.success() => {
                        spotdl_ok = true;
                        messages.push("✅ spotdl installed successfully via pipx".to_string());
                    }
                    _ => messages.push("❌ Failed to install spotdl. Install manually: pip3 install spotdl".to_string()),
                }
            }
        }
    }

    let all_ok = yt_dlp_ok && spotdl_ok && ffmpeg_ok;

    InstallResult {
        success: all_ok,
        message: messages.join("\n"),
        yt_dlp: yt_dlp_ok,
        spotdl: spotdl_ok,
        ffmpeg: ffmpeg_ok,
    }
}
