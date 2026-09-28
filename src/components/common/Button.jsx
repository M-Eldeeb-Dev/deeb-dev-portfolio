import { forwardRef } from "react";
import { useMagnetic } from "../../hooks/useMagnetic";

/**
 * Accessible button / anchor primitive with magnetic hover effect and WCAG AA contrast.
 */
const Button = forwardRef(function Button(
  {
    children,
    as: Component = "button",
    variant = "primary",
    size = "md",
    magnetic = false,
    magneticStrength = 0.2,
    className = "",
    href,
    target,
    rel,
    ...props
  },
  forwardedRef
) {
  const magneticRef = useMagnetic(magneticStrength);
  const elementRef = magnetic ? magneticRef : forwardedRef;

  const Comp = href ? "a" : Component;

  const sizeClasses = {
    sm: "px-3.5 py-1.5 text-xs font-sans font-medium min-h-[38px]",
    md: "px-5 py-2.5 text-sm font-sans font-medium min-h-[44px]",
    lg: "px-6 py-3 text-base font-sans font-semibold min-h-[48px]",
  };

  const variantClasses = {
    // #7C3AED with white text guarantees WCAG AA contrast >= 4.5:1
    primary:
      "bg-violet-600 hover:bg-violet-500 text-white font-semibold shadow-[0_0_20px_-3px_rgba(124,58,237,0.4)] hover:shadow-[0_0_26px_0px_rgba(139,92,246,0.6)] border border-violet-400/30",
    secondary:
      "bg-surface-2 hover:bg-surface-3 text-slate-100 border border-white/10 hover:border-violet-500/40 shadow-sm",
    cyan:
      "bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold shadow-[0_0_20px_-3px_rgba(6,182,212,0.4)] border border-cyan-400/40",
    ghost:
      "bg-transparent text-slate-300 hover:text-white hover:bg-white/5",
    outline:
      "bg-transparent border border-white/15 text-slate-200 hover:text-white hover:border-violet-400/60 hover:bg-violet-950/20",
  };

  const securityRel =
    target === "_blank" ? rel || "noopener noreferrer" : rel;

  return (
    <Comp
      ref={elementRef}
      href={href}
      target={target}
      rel={securityRel}
      className={`inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0 select-none cursor-pointer ${
        sizeClasses[size] || sizeClasses.md
      } ${variantClasses[variant] || variantClasses.primary} ${className}`}
      {...props}
    >
      {children}
    </Comp>
  );
});

export default Button;
