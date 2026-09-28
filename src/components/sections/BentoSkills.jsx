import Section from "../common/Section";
import Reveal from "../common/Reveal";
import GlassCard from "../common/GlassCard";
import Pill from "../common/Pill";
import { skillCategories } from "../../data/skills";

export default function BentoSkills() {
  const getLevelVariant = (level) => {
    switch (level) {
      case "Core":
        return "cyan";
      case "Proficient":
        return "violet";
      case "Familiar":
      default:
        return "default";
    }
  };

  return (
    <Section
      id="skills"
      eyebrow="Technical Stack"
      title="Engineering Capabilities"
      description="Modern full-stack technologies categorized by domain, with transparent proficiency tiers."
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
        {skillCategories.map((category, idx) => {
          // Asymmetric Bento Grid span distribution
          const colSpanClass =
            category.id === "frontend"
              ? "md:col-span-12 lg:col-span-7"
              : category.id === "backend"
              ? "md:col-span-12 lg:col-span-5"
              : "md:col-span-6 lg:col-span-6";

          return (
            <div key={category.id} className={colSpanClass}>
              <Reveal delay={idx * 80}>
                <GlassCard
                  tilt
                  maxTilt={3}
                  glow
                  className="p-6 sm:p-7 flex flex-col justify-between h-full group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-display font-bold text-lg sm:text-xl text-white">
                        {category.title}
                      </h3>
                      <span className="text-xs font-mono text-slate-500">
                        {category.items.length} Skills
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
                      {category.description}
                    </p>

                    <div className="flex flex-wrap gap-2.5">
                      {category.items.map((skill) => {
                        const Icon = skill.icon;
                        const levelVariant = getLevelVariant(skill.level);

                        return (
                          <div
                            key={skill.name}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-surface-2/80 border border-white/[0.06] hover:border-violet-500/40 transition-colors"
                          >
                            <Icon
                              className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110"
                              style={{ color: skill.color }}
                              aria-hidden="true"
                            />
                            <span className="text-xs font-sans font-medium text-slate-200">
                              {skill.name}
                            </span>
                            <Pill
                              variant={levelVariant}
                              size="sm"
                              className="text-[10px] py-0 px-2 uppercase font-mono"
                            >
                              {skill.level}
                            </Pill>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </GlassCard>
              </Reveal>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
