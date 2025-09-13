import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "first-visit-seen";

export function useFirstVisit() {
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(false);
  // Avoid SSR/early render mismatches and handle storage safely
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    try {
      const seen = window.localStorage.getItem(STORAGE_KEY);
      if (!seen) {
        setIsFirstVisit(true);
        // Mark as seen immediately so hard refreshes don’t loop the intro
        window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
      }
    } catch {
      // If storage is blocked, still show once this session
      setIsFirstVisit(true);
    }
  }, []);

  const dismiss = () => setIsFirstVisit(false);

  return { isFirstVisit, dismiss };
}
