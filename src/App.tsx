import { useEffect, useState } from "react";
import LoadingScreen from "./components/LoadingScreen";
import { useFirstVisit } from "./components/hooks/useFirstVisit";
import { initApp } from "./lib/initApp";

export default function App() {
  const { isFirstVisit, dismiss } = useFirstVisit();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Kick off bootstrapping tasks
    initApp().finally(() => setAppReady(true));
  }, []);

  const showIntro = isFirstVisit && !appReady;

  return (
    <div className="min-h-dvh bg-[#F8F6F0] text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      {/* First-visit loader overlay */}
      {showIntro && <LoadingScreen onSkip={dismiss} />}

      {/* Your actual app UI */}
      <header className="sticky top-0 z-40 border-b bg-white/70 backdrop-blur dark:bg-neutral-950/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <span className="font-semibold">My Site</span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Welcome 👋</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Content renders immediately; the loader sits on top only on a first
          visit.
        </p>

        {/* Example: your VSL component fits right in */}
        {/* <VSL videoIdOrUrl="https://youtu.be/..." heading="Intro" /> */}
      </main>
    </div>
  );
}
