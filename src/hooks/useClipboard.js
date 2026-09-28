import { useCallback, useState } from "react";

/**
 * Hook to copy text to system clipboard with fallback and auto-reset.
 * @param {number} [timeout=2500] - Duration in ms before copied state resets
 * @returns {{ copy: (text: string) => Promise<boolean>, copied: boolean, error: Error | null }}
 */
export function useClipboard(timeout = 2500) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const copy = useCallback(
    async (text) => {
      if (typeof window === "undefined") return false;

      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          // Fallback for older browsers
          const textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
        }

        setCopied(true);
        setError(null);

        setTimeout(() => {
          setCopied(false);
        }, timeout);

        return true;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setCopied(false);
        return false;
      }
    },
    [timeout]
  );

  return { copy, copied, error };
}
