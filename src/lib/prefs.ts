import { useSyncExternalStore } from "react";

/**
 * Tiny persisted preference store (language, demo preset).
 * Reads URL params first (?lang=ru, ?demo=sardor), then localStorage, then the server default.
 * Values are also kept in memory, so toggles still work when storage is blocked.
 */

const memory = new Map<string, string>();
const listeners = new Set<() => void>();

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

export function setPref(key: string, value: string) {
  memory.set(key, value);
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* private mode: the in-memory value still drives the UI */
  }
  listeners.forEach((l) => l());
}

export function usePref<T extends string>(key: string, urlParam: string, fallback: T, isValid: (v: string) => v is T): T {
  return useSyncExternalStore(
    subscribe,
    () => {
      const fromMemory = memory.get(key);
      if (fromMemory && isValid(fromMemory)) return fromMemory;
      const fromUrl = new URLSearchParams(window.location.search).get(urlParam);
      if (fromUrl && isValid(fromUrl)) return fromUrl;
      const stored = readStorage(key);
      return stored && isValid(stored) ? stored : fallback;
    },
    () => fallback,
  );
}

const noop = () => () => {};

/** A value that only exists in the browser (null during prerender), without a setState-in-effect. */
export function useClientValue<T>(get: () => T): T | null {
  return useSyncExternalStore(noop, get, () => null);
}
