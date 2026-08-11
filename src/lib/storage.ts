import { useCallback, useEffect, useState } from "react";

/** SSR-safe localStorage state. Reads happen after hydration. */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore corrupt entries */
    }
    setHydrated(true);
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          /* storage full or unavailable */
        }
        return resolved;
      });
    },
    [key],
  );

  return { value, setValue: update, hydrated } as const;
}

export const STORAGE_KEYS = {
  history: "agrishield.history",
  treatments: "agrishield.treatments",
} as const;
