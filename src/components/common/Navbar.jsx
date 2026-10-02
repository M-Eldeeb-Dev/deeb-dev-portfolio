import { useEffect, useRef, useState } from "react";
import { siteConfig } from "../../data/siteConfig";
import { useScrollSpy } from "../../hooks/useScrollSpy";
import { usePlatformModifier } from "../../hooks/useHotkey";
import Pill from "./Pill";
import { LuMenu, LuX, LuCommand } from "react-icons/lu";

const NAV_IDS = siteConfig.navItems.map((item) => item.id);

export default function Navbar({ onOpenCommandMenu }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileDialogRef = useRef(null);
  const activeSection = useScrollSpy(NAV_IDS);
  const { modifier } = usePlatformModifier();

  // Control native dialog for mobile drawer
  useEffect(() => {
    const dialog = mobileDialogRef.current;
    if (!dialog) return;

    if (mobileOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
      document.body.style.overflow = "hidden";
    } else {
      if (dialog.open) {
        dialog.close();
      }
      document.body.style.overflow = "";
    }
  }, [mobileOpen]);

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 pt-3 sm:pt-4">
        <nav
          aria-label="Primary Navigation"
          className="mx-auto max-w-5xl h-14 sm:h-16 rounded-2xl glass-panel glass-panel-blur flex items-center justify-between px-3 sm:px-5"
        >
          {/* Brand Logo & Status Pill */}
          <div className="flex items-center gap-3">
            <a
              href="#hero"
              className="flex items-center gap-2 text-white font-display font-bold tracking-tight text-lg hover:text-cyan-400 transition-colors"
            >
              <span className="h-8 w-8 flex items-center justify-center text-white text-sm font-mono shadow-sm overflow-hidden">
                <img src="/logo.svg" alt="Mohamed Eldeeb Logo" width={32} height={32} className="w-8 h-8 object-contain" />
              </span>
              <span>{siteConfig.shortName}</span>
            </a>

            <div className="hidden lg:block">
              <Pill variant="success" size="sm" dot dotPulse>
                {siteConfig.status.label}
              </Pill>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <ul className="hidden md:flex items-center gap-1 sm:gap-1.5 list-none m-0 p-0">
            {siteConfig.navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative px-3.5 py-1.5 rounded-lg text-xs font-mono tracking-wider uppercase transition-all duration-200 ${
                      isActive
                        ? "text-cyan-400 font-semibold"
                        : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                        aria-hidden="true"
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Command Menu Button & Mobile Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenCommandMenu}
              aria-label="Open Command Menu"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-surface-2 border border-white/10 text-slate-300 hover:text-white hover:border-violet-500/50 transition-colors text-xs font-mono cursor-pointer"
            >
              <LuCommand className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Commands</span>
              <kbd className="px-1.5 py-0.5 rounded bg-surface-1 text-[10px] text-slate-400 border border-white/5">
                {modifier}K
              </kbd>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
            >
              {mobileOpen ? <LuX className="w-5 h-5" /> : <LuMenu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Native Dialog */}
      <dialog
        ref={mobileDialogRef}
        onClose={closeMobileMenu}
        className="fixed inset-0 m-0 p-0 w-full h-full max-w-none max-h-none bg-surface-0/95 backdrop-blur-xl border-none text-slate-100 z-50 md:hidden"
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white text-sm font-mono">
                D
              </span>
              <span className="font-display font-bold text-lg">{siteConfig.shortName}</span>
            </div>
            <button
              type="button"
              onClick={closeMobileMenu}
              aria-label="Close navigation drawer"
              className="p-2 rounded-lg text-slate-400 hover:text-white cursor-pointer"
            >
              <LuX className="w-6 h-6" />
            </button>
          </div>

          <div className="my-4">
            <Pill variant="success" size="sm" dot dotPulse>
              {siteConfig.status.label}
            </Pill>
          </div>

          <nav className="flex flex-col gap-2 my-auto" aria-label="Mobile Navigation">
            {siteConfig.navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={closeMobileMenu}
                className="px-4 py-3 rounded-xl font-display text-lg uppercase tracking-wider text-slate-300 hover:text-cyan-400 hover:bg-surface-2 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => {
                closeMobileMenu();
                onOpenCommandMenu?.();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-surface-2 border border-white/10 text-slate-200 text-sm font-mono cursor-pointer"
            >
              <LuCommand className="w-4 h-4 text-cyan-400" />
              <span>Search Commands ({modifier}K)</span>
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
