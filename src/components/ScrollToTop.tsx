import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSmoothScroll } from "../hooks/useSmoothScroll";

interface ScrollToTopProps {
  behavior?: ScrollBehavior;
  offset?: number;
}

export default function ScrollToTop({ behavior = "smooth", offset = 0 }: ScrollToTopProps) {
  const { pathname, hash } = useLocation();
  const scrollTo = useSmoothScroll(offset);

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace(/^#/, "");

      const attemptScroll = () => scrollTo(targetId, { behavior });

      if (attemptScroll()) {
        return;
      }

      const timeoutId = window.setTimeout(() => {
        attemptScroll();
      }, 100);

      return () => window.clearTimeout(timeoutId);
    }

    if (!scrollTo("top", { behavior })) {
      try {
        window.scrollTo({ top: 0, left: 0, behavior });
      } catch {
        window.scrollTo(0, 0);
      }
    }
  }, [pathname, hash, behavior, scrollTo]);

  return null;
}
