import { useEffect, useState } from "react";

/**
 * Hook to spy on active section ID using IntersectionObserver.
 * Completely eliminates forced reflows caused by querying offsetTop during scroll.
 * @param {string[]} sectionIds - List of section DOM IDs to monitor
 * @returns {string} The active section ID
 */
export function useScrollSpy(sectionIds) {
  const [activeId, setActiveId] = useState(sectionIds[0] || "");

  useEffect(() => {
    if (typeof window === "undefined" || !sectionIds.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-10% 0px -65% 0px",
        threshold: 0,
      }
    );

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [sectionIds]);

  return activeId;
}

