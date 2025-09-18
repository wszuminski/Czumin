import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { LoadingScreen } from "./components/LoadingScreen";
import ScrollToTop from "./components/ScrollToTop";
import { useFirstVisit } from "./components/hooks/useFirstVisit";
import { initApp } from "./lib/initApp";
import { CaseDetailPage } from "./pages/CaseDetail";
import { HomePage } from "./pages/Home";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicy";

export default function App() {
  const { isFirstVisit } = useFirstVisit();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Kick off bootstrapping tasks
    initApp().finally(() => setAppReady(true));
  }, []);

  const showIntro = isFirstVisit && !appReady;
  const introComplete = !showIntro;

  return (
    <div className="min-h-dvh bg-[#F8F6F0] text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      {/* First-visit loader overlay */}
      {showIntro && <LoadingScreen />}
      <div
        className={`transition-opacity duration-700 ease-out delay-150 ${
          introComplete ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!introComplete}
      >
        <ScrollToTop behavior="auto" />
        <Routes>
          <Route path="/" element={<HomePage introComplete={introComplete} />} />
          <Route path="/cases/:caseId" element={<CaseDetailPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
        </Routes>
      </div>
    </div>
  );
}
