import { useEffect, useState } from "react";

/**
 * Hook to listen for global hotkeys (e.g. Cmd+K / Ctrl+K).
 * @param {string} key - Target key code or char (e.g. "k", "Escape")
 * @param {() => void} callback - Handler function
 * @param {Object} [options]
 * @param {boolean} [options.metaOrCtrl=true] - Require either Meta (Mac) or Ctrl (Windows/Linux)
 * @param {boolean} [options.preventDefault=true] - Prevent default browser behavior
 */
export function useHotkey(
  key,
  callback,
  { metaOrCtrl = true, preventDefault = true } = {}
) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleKeyDown = (event) => {
      const isInput =
        event.target instanceof HTMLElement &&
        (event.target.tagName === "INPUT" ||
          event.target.tagName === "TEXTAREA" ||
          event.target.isContentEditable);

      if (key.toLowerCase() !== "escape" && isInput) {
        return;
      }

      const matchesKey = event.key.toLowerCase() === key.toLowerCase();
      const matchesModifier = metaOrCtrl
        ? event.metaKey || event.ctrlKey
        : true;

      if (matchesKey && matchesModifier) {
        if (preventDefault) {
          event.preventDefault();
        }
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [key, callback, metaOrCtrl, preventDefault]);
}

/**
 * Returns platform modifier label ("⌘" for Mac, "Ctrl" for others).
 * @returns {{ modifier: string, isMac: boolean }}
 */
export function usePlatformModifier() {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform || navigator.userAgent));
    }
  }, []);

  return {
    modifier: isMac ? "⌘" : "Ctrl",
    isMac,
  };
}
