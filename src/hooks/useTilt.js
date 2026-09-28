import { useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Hook to apply subtle 3D card tilt and pointer-following glow coordinates.
 * Automatically disabled on touch screens and under reduced motion.
 * @param {Object} [options]
 * @param {number} [options.maxTilt=5] - Maximum rotation in degrees
 * @returns {React.RefObject<HTMLElement>}
 */
export function useTilt({ maxTilt = 4 } = {}) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const card = ref.current;
    if (!card || reducedMotion) return;

    const isTouch = window.matchMedia("(hover: none)").matches;
    if (isTouch) return;

    let rafId = null;

    const handleMouseMove = (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Rotation angles (inverted Y for natural tilt)
      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      // Pointer coordinates for radial glow
      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        card.style.setProperty("--mouse-x", `${xPercent.toFixed(1)}%`);
        card.style.setProperty("--mouse-y", `${yPercent.toFixed(1)}%`);
        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(
          2
        )}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(0)`;
      });
    };

    const handleMouseLeave = () => {
      if (rafId) cancelAnimationFrame(rafId);
      card.style.transition = "transform 300ms cubic-bezier(0.16, 1, 0.3, 1)";
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)";
      card.style.removeProperty("--mouse-x");
      card.style.removeProperty("--mouse-y");

      setTimeout(() => {
        if (card) {
          card.style.transition = "";
        }
      }, 300);
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
      card.style.transform = "";
      card.style.transition = "";
    };
  }, [maxTilt, reducedMotion]);

  return ref;
}
