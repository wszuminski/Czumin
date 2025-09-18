import type { FC } from "react";

interface TopNavProps {
  onContactClick?: () => void;
}

const TopNav: FC<TopNavProps> = ({ onContactClick }) => {

  return (
    <div className="pointer-events-auto absolute inset-x-0 top-0 z-20">
      <div className="container flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <img src="/logo.czumin.png" alt="logo" className="w-12 h-12 rounded-full object-center object-cover" />
          {/* Links */}
          <nav className="hidden gap-6 text-sm text-white/70 md:flex">
            {["CASESTUDY", "KONTAKT"].map((x) => (
              <a
                key={x}
                href="#"
                className="hover:text-white transition-colors"
              >
                {x}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onContactClick}
            className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur hover:bg-white/15"
          >
            Skontaktuj się
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
