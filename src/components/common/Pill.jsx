/**
 * Accessible pill / badge component for stack tags, categories, and status indicators.
 */
export default function Pill({
  children,
  variant = "default",
  size = "md",
  dot = false,
  dotPulse = false,
  className = "",
  ...props
}) {
  const sizeClasses = {
    sm: "px-2.5 py-0.5 text-xs font-mono tracking-tight",
    md: "px-3 py-1 text-xs font-mono tracking-wide",
    lg: "px-4 py-1.5 text-sm font-sans font-medium",
  };

  const variantClasses = {
    default:
      "bg-surface-2 text-slate-300 border border-slate-700/60 shadow-xs",
    violet:
      "bg-violet-950/40 text-violet-400 border border-violet-700/40 shadow-xs",
    cyan: "bg-cyan-950/40 text-cyan-400 border border-cyan-700/40 shadow-xs",
    success:
      "bg-emerald-950/40 text-emerald-400 border border-emerald-700/40 shadow-xs",
    outline:
      "bg-transparent text-slate-300 border border-white/10 hover:border-white/20",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full transition-colors ${
        sizeClasses[size] || sizeClasses.md
      } ${variantClasses[variant] || variantClasses.default} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`h-2 w-2 rounded-full ${
            variant === "success"
              ? "bg-emerald-400"
              : variant === "cyan"
              ? "bg-cyan-400"
              : "bg-violet-400"
          } ${dotPulse ? "animate-pulse" : ""}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
