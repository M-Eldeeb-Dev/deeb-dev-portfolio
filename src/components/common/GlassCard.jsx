import { forwardRef } from "react";
import { useTilt } from "../../hooks/useTilt";

/**
 * Obsidian Cyberpunk Glass Card with 1px gradient border and optional 3D tilt.
 */
const GlassCard = forwardRef(function GlassCard(
  {
    children,
    as: Component = "div",
    tilt = false,
    maxTilt = 4,
    interactive = true,
    glow = false,
    className = "",
    ...props
  },
  forwardedRef
) {
  const tiltRef = useTilt({ maxTilt });
  const cardRef = tilt ? tiltRef : forwardedRef;

  return (
    <Component
      ref={cardRef}
      className={`relative rounded-2xl bg-surface-1 border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.36)] overflow-hidden ${
        interactive ? "interactive-card" : ""
      } ${className}`}
      {...props}
    >
      {/* 1px Gradient Border Overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent [background:linear-gradient(to_bottom,rgba(255,255,255,0.14),transparent_60%)_border-box] [mask:linear-gradient(#fff_0_0)_padding-box,linear-gradient(#fff_0_0)] [mask-composite:exclude]"
        aria-hidden="true"
      />

      {/* Pointer-Following Radial Glow (active on hover when tilt is enabled) */}
      {glow && (
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(139, 92, 246, 0.12), transparent 70%)",
          }}
          aria-hidden="true"
        />
      )}

      {children}
    </Component>
  );
});

export default GlassCard;
