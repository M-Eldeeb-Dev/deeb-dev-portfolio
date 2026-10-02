import { useEffect, useRef, useState } from "react";

/**
 * Hook to trigger element visibility based on IntersectionObserver.
 * @param {Object} options
 * @param {number} [options.threshold=0.15] - Percentage of target visible before triggering
 * @param {string} [options.rootMargin="0px 0px -40px 0px"] - Margin around root bounds
 * @param {boolean} [options.triggerOnce=true] - Only trigger once then disconnect
 * @returns {[React.RefObject<HTMLElement>, boolean]}
 */
export function useInView({
  threshold = 0.08,
  rootMargin = "0px 0px -20px 0px",
  triggerOnce = true,
} = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce) {
            observer.unobserve(node);
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isInView];
}
