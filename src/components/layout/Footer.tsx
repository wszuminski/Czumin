import type { FC } from "react";
import { Link as RouterLink } from "react-router-dom";

interface FooterProps {
  onContactClick?: () => void;
}

const Footer: FC<FooterProps> = ({ onContactClick }) => {
  return (
    <footer className="relative mt-0 overflow-hidden bg-[#0a0a12] text-white">
      {/* Main aurora sun-rise gradient - intense radial from bottom center */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 140% 70% at 50% 105%, rgba(138, 43, 226, 0.85) 0%, rgba(138, 43, 226, 0.5) 15%, rgba(75, 0, 130, 0.3) 30%, transparent 55%),
            radial-gradient(ellipse 180% 70% at 50% 108%, rgba(0, 255, 180, 0.7) 0%, rgba(0, 220, 150, 0.5) 15%, rgba(0, 180, 130, 0.3) 30%, transparent 50%),
            radial-gradient(ellipse 120% 50% at 25% 106%, rgba(0, 255, 200, 0.6) 0%, rgba(0, 200, 150, 0.3) 20%, transparent 40%),
            radial-gradient(ellipse 100% 45% at 75% 106%, rgba(100, 0, 180, 0.5) 0%, transparent 35%),
            radial-gradient(ellipse 200% 100% at 50% 100%, rgba(20, 30, 80, 0.8) 0%, transparent 50%)
          `,
        }}
      />

      {/* Secondary glow layer - more green */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 100% 40% at 50% 102%, rgba(0, 255, 180, 0.5) 0%, transparent 40%),
            radial-gradient(ellipse 90% 35% at 35% 104%, rgba(0, 255, 200, 0.45) 0%, transparent 35%),
            radial-gradient(ellipse 80% 30% at 65% 104%, rgba(150, 50, 255, 0.4) 0%, transparent 30%),
            radial-gradient(ellipse 70% 25% at 50% 103%, rgba(0, 230, 170, 0.35) 0%, transparent 30%)
          `,
        }}
      />

      {/* Deep blue atmosphere layer */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            linear-gradient(to top, rgba(10, 20, 60, 0.6) 0%, rgba(5, 10, 30, 0.3) 40%, transparent 70%)
          `,
        }}
      />

      {/* Grain/noise texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* Content */}
      <div className="relative z-10 container w-full px-4 pt-16 pb-32 sm:pt-20 sm:pb-52 lg:pt-24 lg:pb-72">
        {/* Multi-column link grid - x.ai style */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-12 sm:grid-cols-4 lg:gap-x-32">
          {/* Column 1: Nawigacja */}
          <div>
            <h4 className="text-xs sm:text-sm font-medium uppercase tracking-[0.25em] text-white/60 mb-8">
              Nawigacja
            </h4>
            <nav className="flex flex-col gap-5">
              <RouterLink
                to="/"
                className="text-base sm:text-lg text-white/90 hover:text-white transition-colors"
              >
                Strona główna
              </RouterLink>
              <RouterLink
                to="/#case-study"
                className="text-base sm:text-lg text-white/90 hover:text-white transition-colors"
              >
                Case study
              </RouterLink>
              <a
                href="#proces"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('proces')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-base sm:text-lg text-white/90 hover:text-white transition-colors"
              >
                Proces
              </a>
            </nav>
          </div>

          {/* Column 2: Usługi */}
          <div>
            <h4 className="text-xs sm:text-sm font-medium uppercase tracking-[0.25em] text-white/60 mb-8">
              Usługi
            </h4>
            <nav className="flex flex-col gap-5">
              <RouterLink
                to="/#services"
                className="text-base sm:text-lg text-white/90 hover:text-white transition-colors"
              >
                Strony internetowe
              </RouterLink>
              <RouterLink
                to="/#services"
                className="text-base sm:text-lg text-white/90 hover:text-white transition-colors"
              >
                Aplikacje
              </RouterLink>
              <RouterLink
                to="/#services"
                className="text-base sm:text-lg text-white/90 hover:text-white transition-colors"
              >
                Design
              </RouterLink>
              <RouterLink
                to="/#services"
                className="text-base sm:text-lg text-white/90 hover:text-white transition-colors"
              >
                Marketing
              </RouterLink>
            </nav>
          </div>

          {/* Column 3: Kontakt */}
          <div>
            <h4 className="text-xs sm:text-sm font-medium uppercase tracking-[0.25em] text-white/60 mb-8">
              Kontakt
            </h4>
            <address className="flex flex-col gap-5 not-italic">
              <a
                href="tel:+48660344552"
                className="text-base sm:text-lg text-white/90 hover:text-white transition-colors"
              >
                +48 660 344 552
              </a>
              <a
                href="mailto:czumin.software@gmail.com"
                className="text-base sm:text-lg text-white/90 hover:text-white transition-colors"
              >
                czumin.software@gmail.com
              </a>
              {onContactClick && (
                <button
                  type="button"
                  onClick={onContactClick}
                  className="text-base sm:text-lg text-white/90 hover:text-white transition-colors text-left"
                >
                  Formularz kontaktowy
                </button>
              )}
            </address>
          </div>

          {/* Column 4: Informacje */}
          <div>
            <h4 className="text-xs sm:text-sm font-medium uppercase tracking-[0.25em] text-white/60 mb-8">
              Informacje
            </h4>
            <nav className="flex flex-col gap-5">
              <RouterLink
                to="/privacy"
                className="text-base sm:text-lg text-white/90 hover:text-white transition-colors"
              >
                Polityka prywatności
              </RouterLink>
              <a
                href="#o-nas"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('o-nas')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-base sm:text-lg text-white/90 hover:text-white transition-colors"
              >
                O nas
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom bar with logo */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src="/logo.czumin.png"
              alt="Czumin Logo"
              className="object-center object-cover w-10 h-10 rounded-full"
            />
            <span className="text-base font-medium text-white/80">Czumin</span>
          </div>
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} Czumin Software. Wszelkie prawa zastrzeżone.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
