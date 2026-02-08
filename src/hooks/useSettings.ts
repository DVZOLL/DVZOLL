import { useState, useEffect, useCallback } from "react";

export interface AppSettings {
  downloadPath: string;
  autoUpdate: boolean;
  notifications: boolean;
  concurrentDownloads: number;
  lastMode: "video" | "audio";
  lastQuality: string;
  lastIsPlaylist: boolean;
}

const STORAGE_KEY = "dvzoll-settings";

const DEFAULTS: AppSettings = {
  downloadPath: "~/Downloads/DVZOLL",
  autoUpdate: true,
  notifications: true,
  concurrentDownloads: 3,
  lastMode: "video",
  lastQuality: "1080P",
  lastIsPlaylist: false,
};

function load(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...DEFAULTS, ...JSON.parse(raw) };
    }
  } catch {}
  return { ...DEFAULTS };
}

function save(settings: AppSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {}
}

export function useSettings() {
  const [settings, setSettingsState] = useState<AppSettings>(load);

  const update = useCallback((patch: Partial<AppSettings>) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...patch };
      save(next);
      return next;
    });
  }, []);

  return { settings, update };
}
