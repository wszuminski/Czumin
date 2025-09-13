import { useEffect, useState } from "react";

type Props = {
  onSkip?: () => void;
};

export default function LoadingScreen({ onSkip }: Props) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Allow Escape to skip (accessibility & dev convenience)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onSkip) onSkip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onSkip]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={[
        "fixed inset-0 z-[9999] flex flex-col items-center justify-center",
        "bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100",
        "motion-safe:animate-fade-in",
        isFadingOut ? "motion-safe:animate-fade-out" : "",
      ].join(" ")}
      // If you want to trigger manual fade-out from parent, expose a ref or prop.
    >
      {/* Logo / mark */}
      <div className="mb-6">
        {/* Replace with your SVG/IMG */}
        <div className="h-12 w-12 rounded-2xl bg-neutral-900 dark:bg-neutral-100" />
      </div>

      {/* Spinner */}
      <div
        aria-hidden="true"
        className="h-8 w-8 rounded-full border-2 border-neutral-300 dark:border-neutral-700 border-t-transparent animate-spin"
      />

      <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
        Loading your experience…
      </p>

      {/* Optional skip for accessibility */}
      {onSkip && (
        <button
          type="button"
          onClick={() => setIsFadingOut(true) || onSkip()}
          className="mt-6 rounded-full border px-3 py-1 text-xs hover:bg-neutral-50 dark:hover:bg-neutral-900"
        >
          Skip
        </button>
      )}
    </div>
  );
}
