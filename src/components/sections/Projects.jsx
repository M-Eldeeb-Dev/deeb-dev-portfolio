import { useState, useMemo, useRef, useEffect } from "react";
import Section from "../common/Section";
import Reveal from "../common/Reveal";
import GlassCard from "../common/GlassCard";
import Pill from "../common/Pill";
import Button from "../common/Button";
import { projects, projectCategories } from "../../data/projects";
import {
  LuExternalLink,
  LuLayers,
  LuInfo,
  LuX,
  LuCircleCheck,
} from "react-icons/lu";
import { SiGithub } from "react-icons/si";

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const detailDialogRef = useRef(null);

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    const dialog = detailDialogRef.current;
    if (!dialog) return;

    if (selectedProject) {
      if (!dialog.open) {
        dialog.showModal();
      }
      document.body.style.overflow = "hidden";
    } else {
      if (dialog.open) {
        dialog.close();
      }
      document.body.style.overflow = "";
    }
  }, [selectedProject]);

  const closeDetailDialog = () => {
    setSelectedProject(null);
  };

  return (
    <Section
      id="projects"
      eyebrow="Selected Works"
      title="Featured Projects"
      description="Production web applications and responsive architectures built with high UX polish."
    >
      {/* Category Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div
          role="group"
          aria-label="Filter projects by category"
          className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-surface-1 border border-white/[0.08]"
        >
          {projectCategories.map((category) => {
            const isSelected = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-violet-600 text-white font-semibold shadow-[0_0_16px_rgba(124,58,237,0.4)]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Aria-live results status */}
        <div
          aria-live="polite"
          className="text-xs font-mono text-slate-400 self-center"
        >
          Showing {filteredProjects.length} of {projects.length} projects
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, idx) => (
          <Reveal key={project.id} delay={idx * 70}>
            <GlassCard
              tilt
              maxTilt={3}
              glow
              className="flex flex-col h-full group"
            >
              {/* Aspect Ratio Preview Container with Picture */}
              <div className="relative aspect-[16/10] overflow-hidden bg-surface-2 border-b border-white/[0.08]">
                <picture>
                  <source srcSet={project.image.avif} type="image/avif" />
                  <source srcSet={project.image.webp} type="image/webp" />
                  <img
                    src={project.image.webp}
                    alt={project.image.alt}
                    width={project.image.width}
                    height={project.image.height}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </picture>

                {/* Badges Overlay */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <Pill variant="cyan" size="sm">
                    {project.category}
                  </Pill>
                  <Pill variant="default" size="sm">
                    {project.kind}
                  </Pill>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-white group-hover:text-cyan-400 transition-colors">
                    {project.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed font-sans">
                    {project.summary}
                  </p>

                  {/* Outcome line */}
                  <div className="mt-3.5 flex items-start gap-2 text-xs font-sans text-slate-400 border-l-2 border-violet-500/60 pl-2.5 py-0.5">
                    <span className="font-medium text-slate-200">Outcome:</span>
                    <span className="line-clamp-2">{project.outcome}</span>
                  </div>

                  {/* Stack Tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <Pill key={tech} variant="default" size="sm">
                        {tech}
                      </Pill>
                    ))}
                  </div>
                </div>

                {/* Action Links & Details trigger */}
                <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {project.links.live && (
                      <Button
                        as="a"
                        href={project.links.live}
                        target="_blank"
                        rel="noreferrer"
                        variant="secondary"
                        size="sm"
                      >
                        <LuExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Live Demo</span>
                      </Button>
                    )}

                    {project.links.repo && (
                      <Button
                        as="a"
                        href={project.links.repo}
                        target="_blank"
                        rel="noreferrer"
                        variant="ghost"
                        size="sm"
                      >
                        <SiGithub className="w-3.5 h-3.5" />
                        <span>Code</span>
                      </Button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    aria-label={`View full details for ${project.title}`}
                    className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                    title="View case study details"
                  >
                    <LuInfo className="w-4 h-4 text-cyan-400" />
                  </button>
                </div>
              </div>
            </GlassCard>
          </Reveal>
        ))}
      </div>

      {/* Lightweight Project Detail Modal */}
      <dialog
        ref={detailDialogRef}
        onClose={closeDetailDialog}
        aria-label="Project Case Study Details"
        className="fixed inset-0 z-50 m-auto w-full max-w-2xl max-h-[85vh] rounded-2xl bg-surface-1 border border-white/15 p-0 text-slate-100 shadow-[0_24px_80px_rgba(0,0,0,0.85)] backdrop:bg-black/75 backdrop:backdrop-blur-sm"
      >
        {selectedProject && (
          <div className="flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2.5">
                <Pill variant="cyan" size="sm">
                  {selectedProject.category}
                </Pill>
                <Pill variant="default" size="sm">
                  {selectedProject.kind}
                </Pill>
              </div>
              <button
                type="button"
                onClick={closeDetailDialog}
                aria-label="Close dialog"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <LuX className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <h3 className="font-display font-bold text-2xl text-white">
                  {selectedProject.title}
                </h3>
                <p className="mt-2 text-slate-300 text-sm leading-relaxed">
                  {selectedProject.summary}
                </p>
              </div>

              {/* Technical Outcome */}
              <div className="p-4 rounded-xl bg-surface-2 border border-white/[0.08]">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-2">
                  <LuCircleCheck className="w-4 h-4" />
                  <span>Technical Deliverable & Impact</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-sans">
                  {selectedProject.outcome}
                </p>
              </div>

              {/* Tech Stack */}
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
                  <LuLayers className="w-4 h-4 text-violet-400" />
                  <span>Technologies & Architecture</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.stack.map((item) => (
                    <Pill key={item} variant="violet" size="md">
                      {item}
                    </Pill>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-white/10 bg-surface-0/60 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                {selectedProject.links.live && (
                  <Button
                    as="a"
                    href={selectedProject.links.live}
                    target="_blank"
                    rel="noreferrer"
                    variant="primary"
                    size="sm"
                  >
                    <LuExternalLink className="w-4 h-4" />
                    <span>Open Live Demo</span>
                  </Button>
                )}
                {selectedProject.links.repo && (
                  <Button
                    as="a"
                    href={selectedProject.links.repo}
                    target="_blank"
                    rel="noreferrer"
                    variant="secondary"
                    size="sm"
                  >
                    <SiGithub className="w-4 h-4" />
                    <span>View Repository</span>
                  </Button>
                )}
              </div>
              <Button
                type="button"
                onClick={closeDetailDialog}
                variant="ghost"
                size="sm"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </dialog>
    </Section>
  );
}
