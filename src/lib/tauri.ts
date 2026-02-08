/** Returns true when running inside the Tauri desktop shell. */
export const isTauri = (): boolean =>
  typeof window !== "undefined" && !!(window as any).__TAURI__;

interface DownloadRequest {
  url: string;
  mode: string;
  quality: string;
  platform: string;
  is_playlist: boolean;
  output_dir?: string;
}

interface DownloadResult {
  success: boolean;
  message: string;
  output_path: string | null;
}

interface ToolStatus {
  yt_dlp: boolean;
  spotdl: boolean;
  ffmpeg: boolean;
}

/**
 * Calls a Tauri command. Returns null if not running in Tauri.
 */
async function invoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
  // Tauri v1: invoke lives at window.__TAURI__.tauri.invoke
  const tauriGlobal = (window as any).__TAURI__;
  const invokeFn = tauriGlobal?.tauri?.invoke ?? tauriGlobal?.invoke;
  if (!invokeFn) {
    throw new Error("Tauri runtime not available");
  }
  return invokeFn(cmd, args) as Promise<T>;
}

export const tauriDownload = async (request: DownloadRequest): Promise<DownloadResult> => {
  return invoke<DownloadResult>("download_media", { request });
};

export const tauriCheckTools = async (): Promise<ToolStatus> => {
  return invoke<ToolStatus>("check_tools_installed");
};

export const tauriGetDownloadDir = async (): Promise<string> => {
  return invoke<string>("get_download_dir");
};

export const tauriInstallPrereqs = async () => {
  return invoke("install_prerequisites");
};

export type { DownloadRequest, DownloadResult, ToolStatus };
