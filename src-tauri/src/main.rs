#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod downloader;
mod prerequisites;

use downloader::{download_media, get_download_dir, check_tools_installed};
use prerequisites::install_prerequisites;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            download_media,
            get_download_dir,
            check_tools_installed,
            install_prerequisites,
        ])
        .run(tauri::generate_context!())
        .expect("error while running DVZOLL");
}
