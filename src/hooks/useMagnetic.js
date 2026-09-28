import { useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Hook to apply a subtle magnetic pull effect to buttons on hover.
 * Automatically disabled on touch screens and under reduced motion.
 * @param {number} [strength=0.25] - Pull factor between 0.1 and 0.5
 * @returns {React.RefObject<HTMLElement>}
 */
export function useMagnetic(strength = 0.25) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element || reducedMotion) return;

    const isTouch = window.matchMedia("(hover: none)").matches;
    if (isTouch) return;

    let rafId = null;

    const handleMouseMove = (event) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (event.clientX - centerX) * strength;
      const deltaY = (event.clientY - centerY) * strength;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        element.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
      });
    };

    const handleMouseLeave = () => {
      if (rafId) cancelAnimationFrame(rafId);
      element.style.transition = "transform 250ms cubic-bezier(0.16, 1, 0.3, 1)";
      element.style.transform = "translate3d(0px, 0px, 0)";
      setTimeout(() => {
        if (element) {
          element.style.transition = "";
        }
      }, 250);
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
      element.style.transform = "";
      element.style.transition = "";
    };
  }, [strength, reducedMotion]);

  return ref;
}
