import Section from "../common/Section";
import Reveal from "../common/Reveal";
import GlassCard from "../common/GlassCard";
import Button from "../common/Button";
import { certificates } from "../../data/certificates";
import { LuAward, LuExternalLink, LuCalendar } from "react-icons/lu";

export default function Experience() {
  return (
    <Section
      id="experience"
      eyebrow="Milestones"
      title="Experience & Certifications"
      description="Professional engineering pathways, developer certifications, and software internships."
    >
      <div className="relative pl-6 sm:pl-8 border-l border-white/10 space-y-8 max-w-4xl mx-auto">
        {certificates.map((item, idx) => (
          <Reveal key={item.id} delay={idx * 80}>
            <div className="relative group">
              {/* Timeline Indicator Dot */}
              <div
                className="absolute -left-[31px] sm:-left-[39px] top-6 w-3.5 h-3.5 rounded-full bg-surface-0 border-2 border-cyan-400 group-hover:border-violet-400 group-hover:scale-125 transition-all shadow-[0_0_12px_rgba(34,211,238,0.6)]"
                aria-hidden="true"
              />

              <GlassCard
                tilt
                maxTilt={2}
                className="p-5 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <LuAward className="w-5 h-5 text-cyan-400 shrink-0" />
                    <h3 className="font-display font-bold text-base sm:text-lg text-white">
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                    <LuCalendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{item.year}</span>
                  </div>
                </div>

                <div className="text-xs sm:text-sm font-mono text-violet-400 mb-2">
                  {item.subtitle}
                </div>

                <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                  {item.desc}
                </p>

                {item.link && (
                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                    <Button
                      as="a"
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outline"
                      size="sm"
                    >
                      <LuExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                      <span>View Credential Document</span>
                      <span className="sr-only">(opens in new tab)</span>
                    </Button>
                    <span className="text-[11px] font-mono text-slate-500">
                      External Credential
                    </span>
                  </div>
                )}
              </GlassCard>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
