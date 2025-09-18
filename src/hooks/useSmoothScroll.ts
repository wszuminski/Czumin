export type SmoothScrollFn = (
  idOrElement: string | HTMLElement | null | undefined,
  options?: {
    offset?: number;
    behavior?: ScrollBehavior;
    block?: ScrollLogicalPosition;
  }
) => boolean;

// Hook: returns a function that smoothly scrolls to an element by id.
// Usage: const scrollTo = useSmoothScroll(); scrollTo("contact");
export function useSmoothScroll(defaultOffset = 0): SmoothScrollFn {
  return (idOrElement, options) => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return false;
    }

    const offset = options?.offset ?? defaultOffset;
    const behavior = options?.behavior ?? "smooth";

    let element: HTMLElement | null = null;

    if (typeof idOrElement === "string") {
      const id = idOrElement.startsWith("#")
        ? idOrElement.slice(1)
        : idOrElement;
      if (id === "home" || id === "top") {
        window.scrollTo({ top: 0, behavior });
        return true;
      }
      element = document.getElementById(id);
    } else if (idOrElement instanceof HTMLElement) {
      element = idOrElement;
    } else {
      return false;
    }

    if (!element) return false;

    try {
      const rect = element.getBoundingClientRect();
      const absoluteTop = rect.top + window.pageYOffset;
      const targetTop = absoluteTop - offset;
      window.scrollTo({ top: targetTop, behavior });
      return true;
    } catch {
      // Fallback if something goes wrong
      element.scrollIntoView({ behavior, block: options?.block ?? "start" });
      return true;
    }
  };
}

export default useSmoothScroll;
