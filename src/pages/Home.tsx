import GrokHero from "../components/ui/bggrok";
import AboutSection from "../components/AboutSection";
import { RadialCaseStudy } from "../components/RadialCaseStudy";
import Footer from "../components/layout/Footer";

interface HomePageProps {
  introComplete?: boolean;
}

export function HomePage({ introComplete = true }: HomePageProps) {
  return (
    <main className="bg-black text-white">
      <GrokHero introComplete={introComplete} />
      <AboutSection />
      <RadialCaseStudy />
      <Footer />
    </main>
  );
}

export default HomePage;
