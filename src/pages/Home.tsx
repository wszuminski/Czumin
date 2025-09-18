import { useCallback, useState } from "react";
import GrokHero from "../components/ui/bggrok";
import AboutSection from "../components/AboutSection";
import { RadialCaseStudy } from "../components/RadialCaseStudy";
import Footer from "../components/layout/Footer";
import ContactModal from "../components/ContactModal";

interface HomePageProps {
  introComplete?: boolean;
}

export function HomePage({ introComplete = true }: HomePageProps) {
  const [contactOpen, setContactOpen] = useState(false);
  const openContact = useCallback(() => setContactOpen(true), []);
  const closeContact = useCallback(() => setContactOpen(false), []);

  return (
    <main className="bg-black text-white">
      <GrokHero introComplete={introComplete} onContactClick={openContact} />
      <AboutSection />
      <RadialCaseStudy />
      <Footer onContactClick={openContact} />
      <ContactModal open={contactOpen} onClose={closeContact} />
    </main>
  );
}

export default HomePage;
