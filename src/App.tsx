import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { initApp } from "./lib/initApp";
import { CaseDetailPage } from "./pages/CaseDetail";
import { HomePage } from "./pages/Home";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicy";

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    // Kick off bootstrapping tasks
    initApp().finally(() => setAppReady(true));
  }, []);

  useEffect(() => {
    if (!appReady) return;

    const timeoutId = window.setTimeout(() => {
      setContentVisible(true);
    }, 150);

    return () => window.clearTimeout(timeoutId);
  }, [appReady]);

  const introComplete = contentVisible;

  return (
    <div className="min-h-dvh bg-[#F8F6F0] text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
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
