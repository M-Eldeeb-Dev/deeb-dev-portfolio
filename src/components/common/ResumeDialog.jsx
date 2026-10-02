import { useEffect, useRef, useState } from "react";
import { siteConfig } from "../../data/siteConfig";
import { LuDownload, LuExternalLink, LuX, LuFileText } from "react-icons/lu";
import Button from "./Button";

export default function ResumeDialog({ isOpen, onClose }) {
  const dialogRef = useRef(null);
  const lastActiveElementRef = useRef(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobileDevice(
        window.innerWidth < 768 ||
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          )
      );
    }
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      lastActiveElementRef.current = document.activeElement;
      if (!dialog.open) {
        dialog.showModal();
      }
      document.body.style.overflow = "hidden";
    } else {
      if (dialog.open) {
        dialog.close();
      }
      document.body.style.overflow = "";
      if (lastActiveElementRef.current instanceof HTMLElement) {
        lastActiveElementRef.current.focus();
      }
    }
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  const resumePdfPath = siteConfig.resume.localPath;
  const externalDriveUrl = siteConfig.resume.externalUrl;

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onClose={onClose}
      aria-label="Resume Document Viewer"
      className="fixed inset-0 z-50 m-auto w-full max-w-4xl h-[88vh] rounded-2xl bg-surface-1 border border-white/15 p-0 text-slate-100 shadow-[0_30px_90px_rgba(0,0,0,0.85)] backdrop:bg-black/80 backdrop:backdrop-blur-sm"
    >
      <div className="flex flex-col h-full">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-600/20 text-violet-400">
              <LuFileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm sm:text-base md:text-lg lg:text-xl text-white">
                {siteConfig.name} (CV)
              </h3>
              <p className="text-[11px] sm:text-xs font-mono text-slate-400">
                Full-Stack Software Engineer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              as="a"
              href={resumePdfPath}
              download={siteConfig.resume.filename}
              variant="secondary"
              size="sm"
            >
              <LuDownload className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Download PDF</span>
            </Button>

            <Button
              as="a"
              href={externalDriveUrl}
              target="_blank"
              rel="noreferrer"
              variant="ghost"
              size="sm"
              title="Open Google Drive link"
            >
              <LuExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Drive View</span>
            </Button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
            >
              <LuX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content / Preview Area */}
        <div className="flex-1 bg-surface-0 overflow-hidden relative">
          {isMobileDevice ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <LuFileText className="w-16 h-16 text-cyan-400/60 mb-4" />
              <h4 className="font-display font-semibold text-lg text-white mb-2">
                Mobile PDF Preview
              </h4>
              <p className="text-sm text-slate-400 max-w-sm mb-6">
                Mobile browsers typically download PDFs instead of previewing them in-page. Use the buttons below to download or view in Google Drive.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                <Button
                  as="a"
                  href={resumePdfPath}
                  download={siteConfig.resume.filename}
                  variant="primary"
                  className="w-full"
                >
                  <LuDownload className="w-4 h-4" />
                  Download PDF
                </Button>
                <Button
                  as="a"
                  href={externalDriveUrl}
                  target="_blank"
                  rel="noreferrer"
                  variant="secondary"
                  className="w-full"
                >
                  <LuExternalLink className="w-4 h-4" />
                  Open in Drive
                </Button>
              </div>
            </div>
          ) : (
            <object
              data={resumePdfPath}
              type="application/pdf"
              className="w-full h-full"
            >
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <p className="text-slate-400 mb-4">
                  PDF viewer plugin not detected in your browser.
                </p>
                <Button
                  as="a"
                  href={resumePdfPath}
                  download={siteConfig.resume.filename}
                  variant="primary"
                >
                  <LuDownload className="w-4 h-4" />
                  Download PDF Instead
                </Button>
              </div>
            </object>
          )}
        </div>
      </div>
    </dialog>
  );
}
