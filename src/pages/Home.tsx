import GrokHero from "../components/ui/bggrok";
import AboutSection from "../components/AboutSection";
import { RadialCaseStudy } from "../components/RadialCaseStudy";
import Footer from "../components/layout/Footer";

export function HomePage() {
  return (
    <main className="bg-black text-white">
      <GrokHero />
      <AboutSection />
      <RadialCaseStudy />
      <Footer />
    </main>
  );
}

export default HomePage;
