import GrokHero from "../components/ui/bggrok";
import { RadialCaseStudy } from "../components/RadialCaseStudy";
import Footer from "../components/layout/Footer";

export function HomePage() {
  return (
    <main className="bg-black text-white">
      <GrokHero />
      <RadialCaseStudy />
      <Footer />
    </main>
  );
}

export default HomePage;
