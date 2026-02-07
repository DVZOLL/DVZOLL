use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use tauri::command;
use tokio::process::Command;

#[derive(Debug, Deserialize)]
pub struct DownloadRequest {
    pub url: String,
    pub mode: String,       // "video" or "audio"
    pub quality: String,    // e.g. "1080p", "4k", "mp3-320", "flac"
    pub platform: String,   // "youtube", "spotify", or "other"
    pub is_playlist: bool,
}

#[derive(Debug, Serialize)]
pub struct DownloadResult {
    pub success: bool,
    pub message: String,
    pub output_path: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct ToolStatus {
    pub yt_dlp: bool,
    pub spotdl: bool,
    pub ffmpeg: bool,
}

fn get_output_dir() -> PathBuf {
    let base = dirs::download_dir().unwrap_or_else(|| dirs::home_dir().unwrap().join("Downloads"));
    base.join("DVZOLL")
}

#[command]
pub fn get_download_dir() -> String {
    get_output_dir().to_string_lossy().to_string()
}

#[command]
pub async fn check_tools_installed() -> ToolStatus {
    let yt_dlp = Command::new("yt-dlp").arg("--version").output().await.is_ok();
    let spotdl = Command::new("spotdl").arg("--version").output().await.is_ok();
    let ffmpeg = Command::new("ffmpeg").arg("-version").output().await.is_ok();
    ToolStatus { yt_dlp, spotdl, ffmpeg }
}

#[command]
pub async fn download_media(request: DownloadRequest) -> DownloadResult {
    let output_dir = get_output_dir();

    // Ensure output directory exists
    if let Err(e) = tokio::fs::create_dir_all(&output_dir).await {
        return DownloadResult {
            success: false,
            message: format!("Failed to create output directory: {}", e),
            output_path: None,
        };
    }

    match request.platform.as_str() {
        "spotify" => download_spotify(&request, &output_dir).await,
        _ => download_ytdlp(&request, &output_dir).await,
    }
}

async fn download_ytdlp(req: &DownloadRequest, output_dir: &PathBuf) -> DownloadResult {
    let output_template = output_dir.join("%(title)s.%(ext)s").to_string_lossy().to_string();

    let mut args: Vec<String> = vec![
        req.url.clone(),
        "-o".to_string(),
        output_template,
        "--no-overwrites".to_string(),
        "--ffmpeg-location".to_string(),
        "ffmpeg".to_string(),
    ];

    if req.mode == "audio" {
        args.push("-x".to_string());
        match req.quality.as_str() {
            "flac" => {
                args.push("--audio-format".to_string());
                args.push("flac".to_string());
            }
            "wav" => {
                args.push("--audio-format".to_string());
                args.push("wav".to_string());
            }
            "aac" => {
                args.push("--audio-format".to_string());
                args.push("m4a".to_string());
            }
            _ => {
                // mp3-320 default
                args.push("--audio-format".to_string());
                args.push("mp3".to_string());
                args.push("--audio-quality".to_string());
                args.push("0".to_string());
            }
        }
    } else {
        // Video mode
        let format_str = match req.quality.as_str() {
            "4k" | "2160p" => "bestvideo[height<=2160]+bestaudio/best[height<=2160]",
            "2k" | "1440p" => "bestvideo[height<=1440]+bestaudio/best[height<=1440]",
            "1080p" => "bestvideo[height<=1080]+bestaudio/best[height<=1080]",
            "720p" => "bestvideo[height<=720]+bestaudio/best[height<=720]",
            _ => "bestvideo+bestaudio/best",
        };
        args.push("-f".to_string());
        args.push(format_str.to_string());
        args.push("--merge-output-format".to_string());
        args.push("mp4".to_string());
    }

    if req.is_playlist {
        args.push("--yes-playlist".to_string());
    } else {
        args.push("--no-playlist".to_string());
    }

    let output = Command::new("yt-dlp")
        .args(&args)
        .output()
        .await;

    match output {
        Ok(result) => {
            let stdout = String::from_utf8_lossy(&result.stdout).to_string();
            let stderr = String::from_utf8_lossy(&result.stderr).to_string();

            if result.status.success() {
                DownloadResult {
                    success: true,
                    message: format!("Download complete!\n{}", stdout),
                    output_path: Some(output_dir.to_string_lossy().to_string()),
                }
            } else {
                DownloadResult {
                    success: false,
                    message: format!("yt-dlp error:\n{}\n{}", stdout, stderr),
                    output_path: None,
                }
            }
        }
        Err(e) => DownloadResult {
            success: false,
            message: format!("Failed to run yt-dlp: {}. Make sure yt-dlp is installed.", e),
            output_path: None,
        },
    }
}

async fn download_spotify(req: &DownloadRequest, output_dir: &PathBuf) -> DownloadResult {
    let mut args: Vec<String> = vec![
        "download".to_string(),
        req.url.clone(),
        "--output".to_string(),
        output_dir.to_string_lossy().to_string(),
    ];

    match req.quality.as_str() {
        "flac" => {
            args.push("--format".to_string());
            args.push("flac".to_string());
        }
        "wav" => {
            args.push("--format".to_string());
            args.push("wav".to_string());
        }
        "aac" => {
            args.push("--format".to_string());
            args.push("m4a".to_string());
        }
        _ => {
            args.push("--format".to_string());
            args.push("mp3".to_string());
            args.push("--bitrate".to_string());
            args.push("320k".to_string());
        }
    }

    let output = Command::new("spotdl")
        .args(&args)
        .output()
        .await;

    match output {
        Ok(result) => {
            let stdout = String::from_utf8_lossy(&result.stdout).to_string();
            let stderr = String::from_utf8_lossy(&result.stderr).to_string();

            if result.status.success() {
                DownloadResult {
                    success: true,
                    message: format!("Spotify download complete!\n{}", stdout),
                    output_path: Some(output_dir.to_string_lossy().to_string()),
                }
            } else {
                DownloadResult {
                    success: false,
                    message: format!("spotdl error:\n{}\n{}", stdout, stderr),
                    output_path: None,
                }
            }
        }
        Err(e) => DownloadResult {
            success: false,
            message: format!("Failed to run spotdl: {}. Make sure spotdl is installed.", e),
            output_path: None,
        },
    }
}
