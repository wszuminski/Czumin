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

  return (
    <div className="min-h-dvh bg-[#F8F6F0] text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      {/* First-visit loader overlay */}
      {showIntro && <LoadingScreen />}
      <ScrollToTop behavior="auto" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cases/:caseId" element={<CaseDetailPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
      </Routes>
    </div>
  );
}
