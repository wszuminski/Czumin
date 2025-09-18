import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { CaseDetailPage } from "./pages/CaseDetail";
import { HomePage } from "./pages/Home";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicy";

export default function App() {

 
  return (
    <div className="min-h-dvh bg-[#F8F6F0] text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div
      
      >
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cases/:caseId" element={<CaseDetailPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
        </Routes>
      </div>
    </div>
  );
}
