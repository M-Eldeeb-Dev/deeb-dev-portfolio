import { useEffect, useRef, useState, useMemo } from "react";
import { siteConfig } from "../../data/siteConfig";
import { useClipboard } from "../../hooks/useClipboard";
import { useToast } from "./Toast";
import {
  LuSearch,
  LuFileText,
  LuCopy,
  LuExternalLink,
  LuCompass,
  LuX,
  LuCornerDownLeft,
  LuLinkedin,
} from "react-icons/lu";
import { SiGithub } from "react-icons/si";

export default function CommandMenu({ isOpen, onClose, onOpenResume }) {
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const lastActiveElementRef = useRef(null);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { copy } = useClipboard();
  const { toast } = useToast();

  const commands = useMemo(() => {
    return [
      // Navigation commands
      ...siteConfig.navItems.map((item) => ({
        id: `nav-${item.id}`,
        category: "Navigation",
        label: `Go to ${item.label}`,
        icon: LuCompass,
        action: () => {
          const el = document.getElementById(item.id);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        },
      })),
      // Actions
      {
        id: "action-resume",
        category: "Actions",
        label: "View Resume (PDF Modal)",
        icon: LuFileText,
        action: () => {
          onOpenResume?.();
        },
      },
      {
        id: "action-copy-email",
        category: "Actions",
        label: "Copy Email Address",
        icon: LuCopy,
        action: async () => {
          await copy(siteConfig.email);
          toast({
            title: "Copied!",
            message: `Email copied to clipboard (${siteConfig.email})`,
            type: "success",
          });
        },
      },
      // Socials
      {
        id: "social-github",
        category: "Socials",
        label: "Open GitHub Profile",
        icon: SiGithub,
        action: () => {
          window.open("https://github.com/M-Eldeeb-Dev", "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "social-linkedin",
        category: "Socials",
        label: "Open LinkedIn Profile",
        icon: LuLinkedin,
        action: () => {
          window.open(
            "https://www.linkedin.com/in/mohamed-eldeeb-78b83730b",
            "_blank",
            "noopener,noreferrer"
          );
        },
      },
    ];
  }, [copy, onOpenResume, toast]);

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    const lower = query.toLowerCase();
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(lower) ||
        c.category.toLowerCase().includes(lower)
    );
  }, [commands, query]);

  // Dialog open/close lifecycle and focus restoration
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      lastActiveElementRef.current = document.activeElement;
      if (!dialog.open) {
        dialog.showModal();
      }
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
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

  // Keyboard navigation inside listbox
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev <= 0 ? filteredCommands.length - 1 : prev - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        onClose();
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onClose={onClose}
      aria-label="Command Palette"
      className="fixed inset-0 z-50 m-auto w-full max-w-xl rounded-2xl bg-surface-1 border border-white/15 p-0 text-slate-100 shadow-[0_24px_80px_rgba(0,0,0,0.8)] backdrop:bg-black/75 backdrop:backdrop-blur-sm"
    >
      <div className="flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
          <LuSearch className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-autocomplete="list"
            aria-controls="command-listbox"
            aria-activedescendant={
              filteredCommands[selectedIndex]
                ? filteredCommands[selectedIndex].id
                : undefined
            }
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or section..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close command menu"
            className="p-1 text-slate-400 hover:text-white rounded-md cursor-pointer"
          >
            <LuX className="w-4 h-4" />
          </button>
        </div>

        {/* Results Listbox */}
        <div
          id="command-listbox"
          role="listbox"
          tabIndex={-1}
          className="overflow-y-auto p-2 space-y-1 max-h-80"
        >
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">
              No matching commands found.
            </div>
          ) : (
            filteredCommands.map((command, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = command.icon;

              return (
                <div
                  key={command.id}
                  id={command.id}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => {
                    command.action();
                    onClose();
                  }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-violet-600/30 text-cyan-30 border border-violet-500/40"
                      : "text-slate-300 hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isSelected ? "text-cyan-400" : "text-slate-400"
                      }`}
                    />
                    <span>{command.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase text-slate-500">
                      {command.category}
                    </span>
                    {isSelected && (
                      <LuCornerDownLeft className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2.5 border-t border-white/10 bg-surface-0/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-slate-500">{siteConfig.shortName} OS v1.0</span>
        </div>
      </div>
    </dialog>
  );
}
