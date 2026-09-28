import { useState, useCallback } from "react";

// Common Components
import { ToastProvider } from "./components/common/Toast";
import Background from "./components/common/Background";
import Navbar from "./components/common/Navbar";
import CommandMenu from "./components/common/CommandMenu";
import ResumeDialog from "./components/common/ResumeDialog";
import Footer from "./components/common/Footer";

// Section Components
import Hero from "./components/sections/Hero";
import BentoSkills from "./components/sections/BentoSkills";
import Projects from "./components/sections/Projects";
import Services from "./components/sections/Services";
import Experience from "./components/sections/Experience";
import Contact from "./components/sections/Contact";

// Hooks
import { useHotkey } from "./hooks/useHotkey";

export default function App() {
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);
  const [resumeDialogOpen, setResumeDialogOpen] = useState(false);

  const toggleCommandMenu = useCallback(() => {
    setCommandMenuOpen((prev) => !prev);
  }, []);

  const openResume = useCallback(() => {
    setResumeDialogOpen(true);
  }, []);

  const closeResume = useCallback(() => {
    setResumeDialogOpen(false);
  }, []);

  const closeCommandMenu = useCallback(() => {
    setCommandMenuOpen(false);
  }, []);

  // Ctrl/Cmd + K → Toggle Command Menu
  useHotkey("k", toggleCommandMenu, { metaOrCtrl: true });

  return (
    <ToastProvider>
      <div className="min-h-screen font-sans text-slate-100">
        {/* Fixed Background Layer */}
        <Background />

        {/* Navigation */}
        <Navbar onOpenCommandMenu={toggleCommandMenu} />

        {/* Main Content */}
        <main id="main-content">
          <Hero onOpenResume={openResume} />
          <BentoSkills />
          <Projects />
          <Services />
          <Experience />
          <Contact />
        </main>

        {/* Footer */}
        <Footer />

        {/* Modals & Overlays */}
        <CommandMenu
          isOpen={commandMenuOpen}
          onClose={closeCommandMenu}
          onOpenResume={openResume}
        />
        <ResumeDialog isOpen={resumeDialogOpen} onClose={closeResume} />
      </div>
    </ToastProvider>
  );
}
