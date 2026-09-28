import { useInView } from "../../hooks/useInView";
import { useReducedMotion } from "../../hooks/useReducedMotion";

/**
 * CSS-driven progressive reveal wrapper.
 * Animate only transform and opacity via CSS transitions.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  threshold = 0.12,
}) {
  const [ref, isInView] = useInView({ threshold, triggerOnce: true });
  const reducedMotion = useReducedMotion();

  const isVisible = reducedMotion || isInView;

  return (
    <div
      ref={ref}
      className={`reveal-item ${isVisible ? "is-revealed" : ""} ${className}`}
      style={{
        transitionDelay: reducedMotion || delay === 0 ? "0ms" : `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
