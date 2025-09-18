import type { FC } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const Footer: FC = () => {
  const navigate = useNavigate();
  return (
    <footer className="relative border-t border-white/10 bg-black/90 text-white">
      {/* subtle top gradient accent */}
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px w-full bg-gradient-to-r from-indigo-500/60 via-violet-500/60 to-blue-500/60" />
      <div className="container w-full px-4 py-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.czumin.png" alt="Logo" className="object-center object-cover w-12 h-12 rounded-full" />
            <div>
              <p className="text-sm font-medium">Czumin Software</p>
              <p className="text-xs text-white/60">Design, strony internetowe, aplikacje i marketing</p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-4 text-xs text-white/70">
            <button
              onClick={() => navigate("/")}
              className="hover:text-white transition-colors"
            >
              Strona główna
            </button>
            <RouterLink to="/" className="hover:text-white transition-colors">
              Case study
            </RouterLink>
            <a
              href="#kontakt"
              className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white/90 backdrop-blur hover:bg-white/15"
            >
              Kontakt
            </a>
          </nav>
        </div>

        <div className="mt-8 flex flex-col-reverse items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Czumin. Wszelkie prawa zastrzeżone.</p>
          <div className="flex items-center gap-3">          <span className="text-white/30">•</span>
            <RouterLink to="/privacy" className="hover:text-white/80">Polityka prywatności</RouterLink>
            <span className="text-white/30">•</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
