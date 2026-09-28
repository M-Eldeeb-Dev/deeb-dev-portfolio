import { forwardRef } from "react";

/**
 * Accessible semantic section container with heading hierarchy and scroll anchoring.
 */
const Section = forwardRef(function Section(
  {
    id,
    title,
    eyebrow,
    description,
    children,
    className = "",
    contentVisibility = true,
  },
  ref
) {
  return (
    <section
      ref={ref}
      id={id}
      className={`scroll-mt-24 py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${
        contentVisibility ? "content-visibility-auto" : ""
      } ${className}`}
    >
      {(title || eyebrow || description) && (
        <div className="mb-10 sm:mb-14">
          {eyebrow && (
            <div className="inline-block text-xs font-mono tracking-widest text-cyan-400 uppercase mb-2">
              {eyebrow}
            </div>
          )}
          {title && (
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-100 tracking-tight">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-3 text-slate-400 text-base sm:text-lg max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
});

export default Section;
