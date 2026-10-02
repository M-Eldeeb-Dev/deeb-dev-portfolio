import { useEffect, useState } from "react";

/**
 * Hook to detect whether the user prefers reduced motion.
 * Defaults to false so animations play by default, while supporting explicit opt-in
 * via localStorage or document data-attribute.
 * @returns {boolean} True if reduced motion is explicitly preferred
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    // Check for explicit user choice in portfolio first
    const explicitPref = localStorage.getItem("portfolio_reduced_motion");
    if (explicitPref !== null) {
      return explicitPref === "true";
    }
    // Check if document has explicit reduced motion attribute
    if (document.documentElement.dataset.reducedMotion === "true") {
      return true;
    }
    // Default to false so modern rich animations play smoothly
    return false;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorage = (event) => {
      if (event.key === "portfolio_reduced_motion") {
        setPrefersReducedMotion(event.newValue === "true");
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return prefersReducedMotion;
}

