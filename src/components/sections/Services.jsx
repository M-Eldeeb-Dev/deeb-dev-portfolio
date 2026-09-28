import Section from "../common/Section";
import Reveal from "../common/Reveal";
import GlassCard from "../common/GlassCard";
import { services } from "../../data/services";
import { LuGlobe, LuSmartphone, LuPalette } from "react-icons/lu";

export default function Services() {
  const getServiceIcon = (key) => {
    switch (key) {
      case "web":
        return <LuGlobe className="w-7 h-7 text-cyan-400" />;
      case "mobile":
        return <LuSmartphone className="w-7 h-7 text-violet-400" />;
      case "design":
      default:
        return <LuPalette className="w-7 h-7 text-emerald-400" />;
    }
  };

  return (
    <Section
      id="services"
      eyebrow="Solutions"
      title="Services & Capabilities"
      description="Professional engineering services for modern web platforms, mobile applications, and design systems."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service, idx) => (
          <Reveal key={service.id} delay={idx * 80}>
            <GlassCard
              tilt
              maxTilt={3}
              glow
              className="p-6 sm:p-7 flex flex-col justify-between h-full group"
            >
              <div>
                <div className="p-3.5 rounded-2xl bg-surface-2 border border-white/[0.08] inline-flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                  {getServiceIcon(service.iconKey)}
                </div>

                <h3 className="font-display font-bold text-lg sm:text-xl text-white group-hover:text-cyan-400 transition-colors">
                  {service.title}
                </h3>

                <p className="mt-3 text-sm text-slate-300 font-sans leading-relaxed">
                  {service.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-500">
                <span>Production Standard</span>
                <span className="text-cyan-400">0{idx + 1}</span>
              </div>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
