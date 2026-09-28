import { siteConfig } from "../../data/siteConfig";
import { LuArrowUp } from "react-icons/lu";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-white/[0.08] bg-surface-1/60 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-400">
        {/* Brand & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <span className="font-display font-semibold text-slate-200">
            {siteConfig.name}
          </span>
          <span className="hidden sm:inline text-slate-600">·</span>
          <span>© {new Date().getFullYear()} All rights reserved.</span>
        </div>

        {/* Quick Nav Anchor Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono uppercase tracking-wider">
          {siteConfig.navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="text-slate-400 hover:text-cyan-400 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Back to top */}
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top of page"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-2 border border-white/5 hover:border-cyan-500/40 text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <span>Top</span>
          <LuArrowUp className="w-3.5 h-3.5 text-cyan-400" />
        </button>
      </div>
    </footer>
  );
}
