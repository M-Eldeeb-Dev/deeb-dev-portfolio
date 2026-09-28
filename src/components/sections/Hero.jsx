import { siteConfig } from "../../data/siteConfig";
import { projects } from "../../data/projects";
import { certificates } from "../../data/certificates";
import { useTypewriter } from "../../hooks/useTypewriter";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useClipboard } from "../../hooks/useClipboard";
import { useToast } from "../common/Toast";
import Button from "../common/Button";
import GlassCard from "../common/GlassCard";
import Pill from "../common/Pill";
import { HeroParticles } from "../common/Background";
import avatarWebp from "../../assets/me.webp";
import avatarAvif from "../../assets/me.avif";
import avatarPng from "../../assets/me.png";
import {
  LuArrowDownRight,
  LuFileText,
  LuCopy,
  LuCheck,
  LuCode,
  LuAward,
  LuSparkles,
} from "react-icons/lu";

export default function Hero({ onOpenResume }) {
  const reducedMotion = useReducedMotion();
  const { copy, copied } = useClipboard();
  const { toast } = useToast();

  const typewriterPhrases = [
    "Full-Stack Engineer",
    "React & Laravel Specialist",
    "Scalable Architectures",
  ];

  const cycledPhrase = useTypewriter(typewriterPhrases, {
    typingSpeed: 70,
    deletingSpeed: 35,
    pauseDuration: 2200,
    reducedMotion,
  });

  const handleCopyEmail = async () => {
    const success = await copy(siteConfig.email);
    if (success) {
      toast({
        title: "Email Copied!",
        message: `${siteConfig.email} has been copied to your clipboard.`,
        type: "success",
      });
    }
  };

  return (
    <section
      id="hero"
      aria-label="Introduction & Overview"
      className="relative min-h-[92dvh] flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Scoped Hero Particle Canvas */}
      <HeroParticles />

      {/* Bento Grid Hero Layout */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 relative z-10">
        {/* Main Headline & Bio Tile (Col 1-8) */}
        <GlassCard
          tilt
          maxTilt={3}
          glow
          className="md:col-span-8 p-6 sm:p-8 lg:p-10 flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Pill variant="cyan" size="sm" dot>
                PORTFOLIO 2026
              </Pill>
              <Pill variant="success" size="sm" dot dotPulse className="sm:inline-flex">
                {siteConfig.status.label}
              </Pill>
            </div>

            {/* Static H1 for SEO & LCP */}
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08]">
              {siteConfig.name}
            </h1>

            {/* Accessible Typewriter Cycler */}
            <div className="mt-3 flex items-center gap-2 text-lg sm:text-2xl font-mono text-cyan-400 font-semibold min-h-[2rem]">
              <span className="sr-only">Full-Stack Software Engineer</span>
              <span aria-hidden="true" className="tracking-tight">
                {cycledPhrase}
              </span>
              <span
                aria-hidden="true"
                className="w-2 h-6 bg-cyan-400 inline-block animate-pulse"
              />
            </div>

            {/* Bio with personality */}
            <p className="mt-5 text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl font-sans">
              I craft high-performance web applications with a focus on clean design,
              solid architecture, and scalability — and yes, I do have a soft spot for potatoes 🥔.
            </p>
          </div>

          {/* CTAs */}
          <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-wrap items-center gap-3 sm:gap-4">
            <Button
              as="a"
              href="#projects"
              variant="primary"
              size="md"
              magnetic
              magneticStrength={0.25}
            >
              <span>Explore Work</span>
              <LuArrowDownRight className="w-4 h-4" />
            </Button>

            <Button
              type="button"
              onClick={onOpenResume}
              variant="secondary"
              size="md"
              magnetic
              magneticStrength={0.2}
            >
              <LuFileText className="w-4 h-4 text-cyan-400" />
              <span>View Resume</span>
            </Button>

            <Button
              type="button"
              onClick={handleCopyEmail}
              variant="ghost"
              size="md"
              title="Copy email address"
            >
              {copied ? (
                <>
                  <LuCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-mono text-xs">Copied!</span>
                </>
              ) : (
                <>
                  <LuCopy className="w-4 h-4 text-slate-400" />
                  <span className="font-mono text-xs">Copy Email</span>
                </>
              )}
            </Button>
          </div>
        </GlassCard>

        {/* Profile Avatar Tile (Col 9-12) */}
        <GlassCard
          tilt
          maxTilt={4}
          glow
          className="md:col-span-4 p-6 sm:p-8 flex flex-col items-center justify-center text-center group relative"
        >
          <div className="relative mb-5">
            {/* Slow Conic Gradient Ambient Ring */}
            <div
              className={`absolute -inset-2 rounded-full opacity-70 blur-md ${
                reducedMotion ? "" : "animate-spin-slow"
              }`}
              style={{
                background:
                  "conic-gradient(from 0deg, #8b5cf6, #06b6d4, #7c3aed, #8b5cf6)",
              }}
              aria-hidden="true"
            />

            {/* Avatar Frame */}
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-2 border-white/20 bg-surface-2 shadow-2xl">
              <picture>
                <source srcSet={avatarAvif} type="image/avif" />
                <source srcSet={avatarWebp} type="image/webp" />
                <img
                  src={avatarPng}
                  alt="Portrait photo of Mohamed Eldeeb"
                  width={600}
                  height={600}
                  fetchPriority="high"
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </picture>
            </div>
          </div>

          <div className="font-display font-bold text-lg text-white">
            Mohamed Eldeeb
          </div>
          <div className="text-xs font-mono text-slate-400 mt-1">
            Cairo, Egypt · UTC+2
          </div>
        </GlassCard>

        {/* Stat Tile 1: Project Count */}
        <GlassCard className="md:col-span-4 p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-violet-950/60 border border-violet-700/40 text-violet-400 shrink-0">
            <LuCode className="w-6 h-6" />
          </div>
          <div>
            <div className="font-display text-2xl font-bold text-white">
              {projects.length}
            </div>
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Featured Projects
            </div>
          </div>
        </GlassCard>

        {/* Stat Tile 2: Credentials & Certifications */}
        <GlassCard className="md:col-span-4 p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-700/40 text-cyan-400 shrink-0">
            <LuAward className="w-6 h-6" />
          </div>
          <div>
            <div className="font-display text-2xl font-bold text-white">
              {certificates.length}
            </div>
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Certifications & Pathways
            </div>
          </div>
        </GlassCard>

        {/* Stat Tile 3: Focus & Engineering Standard */}
        <GlassCard className="md:col-span-4 p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-700/40 text-emerald-400 shrink-0">
            <LuSparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="font-display text-2xl font-bold text-white">
              Full-Stack
            </div>
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              React · Laravel · Node
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
