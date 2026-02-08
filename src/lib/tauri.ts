/**
 * Tauri desktop detection & invoke helper.
 *
 * In the browser (Lovable preview / hosted website) `window.__TAURI__` is
 * undefined, so every call gracefully falls back to `null` / `false`.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tauriWindow = (window as any).__TAURI__;

/** `true` when running inside the Tauri desktop shell */
export const isTauri: boolean = Boolean(tauriWindow);

/**
 * Typed wrapper around Tauri's `invoke`.
 * Returns `null` in the browser so callers can guard easily.
 */
export async function tauriInvoke<T>(
  cmd: string,
  args?: Record<string, unknown>,
): Promise<T | null> {
  if (!tauriWindow?.invoke) return null;
  return tauriWindow.invoke(cmd, args) as Promise<T>;
}

/** Types matching the Rust backend */
export interface DownloadRequest {
  url: string;
  mode: string;
  quality: string;
  platform: string;
  is_playlist: boolean;
}

export interface DownloadResult {
  success: boolean;
  message: string;
  output_path: string | null;
}

export interface ToolStatus {
  yt_dlp: boolean;
  spotdl: boolean;
  ffmpeg: boolean;
}
