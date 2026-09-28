import { useEffect, useState } from "react";

/**
 * Hook to spy on active section ID based on scroll position.
 * @param {string[]} sectionIds - List of section DOM IDs to monitor
 * @param {number} [offset=120] - Top offset in pixels (header height + buffer)
 * @returns {string} The active section ID
 */
export function useScrollSpy(sectionIds, offset = 120) {
  const [activeId, setActiveId] = useState(sectionIds[0] || "");

  useEffect(() => {
    if (typeof window === "undefined" || !sectionIds.length) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            setActiveId(id);
            return;
          }
        }
      }

      // Default to first section when scrolled near the top
      setActiveId(sectionIds[0]);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sectionIds, offset]);

  return activeId;
}
