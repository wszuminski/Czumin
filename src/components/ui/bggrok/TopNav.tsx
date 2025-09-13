import type { FC } from "react";

const TopNav: FC = () => {
  return (
    <div className="pointer-events-auto absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div className="h-8 w-8 rounded bg-white/10 ring-1 ring-white/15 flex items-center justify-center">
            <span className="sr-only">xAI</span>
            <div className="h-4 w-4 rotate-45 bg-white" />
          </div>
          {/* Links */}
          <nav className="hidden gap-6 text-sm text-white/70 md:flex">
            {["GROK", "API", "COMPANY", "COLOSSUS", "CAREERS", "NEWS"].map(
              (x) => (
                <a key={x} href="#" className="hover:text-white transition-colors">
                  {x}
                </a>
              )
            )}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur hover:bg-white/15"
          >
            TRY GROK
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopNav;

