/** Returns true when running inside the Tauri desktop shell. */
export const isTauri = (): boolean =>
  typeof window !== "undefined" && !!(window as any).__TAURI__;
