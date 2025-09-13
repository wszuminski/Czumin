import { useEffect, useState } from "react";
import { LoadingScreen } from "./components/LoadingScreen";
import { useFirstVisit } from "./components/hooks/useFirstVisit";
import { initApp } from "./lib/initApp";

import { DemoOne } from "./components/Hero";

export default function App() {
  const { isFirstVisit } = useFirstVisit();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Kick off bootstrapping tasks
    initApp().finally(() => setAppReady(true));
  }, []);

  const showIntro = isFirstVisit && !appReady;

  return (
    <div className="min-h-dvh bg-[#F8F6F0] text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      {/* First-visit loader overlay */}
      {showIntro && <LoadingScreen />}
      <DemoOne />
    </div>
  );
}
