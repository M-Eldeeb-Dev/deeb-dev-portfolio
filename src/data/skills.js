import {
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNodedotjs,
  SiTailwindcss,
  SiLaravel,
  SiPython,
  SiMysql,
  SiNextdotjs,
  SiMongodb,
  SiGit,
  SiDocker,
  SiFigma,
  SiGraphql,
  SiExpress,
  SiPostgresql,
  SiHtml5,
  SiCss,
} from "react-icons/si";
import { LuNetwork } from "react-icons/lu";

/**
 * @typedef {"Core" | "Proficient" | "Familiar"} SkillLevel
 */

/**
 * @typedef {Object} SkillItem
 * @property {string} name - Display name of skill
 * @property {SkillLevel} level - Qualitative proficiency tier
 * @property {React.ComponentType} icon - React icon component
 * @property {string} color - Brand highlight color
 * @property {boolean} [isOriginalBadge=true] - Whether it existed on the original site
 */

/**
 * @typedef {Object} SkillCategory
 * @property {string} id - Category key
 * @property {string} title - Section title
 * @property {string} description - Focus overview
 * @property {SkillItem[]} items - List of technologies
 */

/** @type {SkillCategory[]} */
export const skillCategories = [
  {
    id: "frontend",
    title: "Frontend Engineering",
    description: "Component architecture, accessible UI, and performance-tuned SPAs.",
    items: [
      { name: "React", level: "Core", icon: SiReact, color: "#61DAFB", isOriginalBadge: true },
      { name: "TypeScript", level: "Core", icon: SiTypescript, color: "#3178C6", isOriginalBadge: true },
      { name: "JavaScript", level: "Core", icon: SiJavascript, color: "#F7DF1E", isOriginalBadge: true },
      { name: "Tailwind CSS", level: "Core", icon: SiTailwindcss, color: "#06B6D4", isOriginalBadge: true },
      { name: "Next.js", level: "Proficient", icon: SiNextdotjs, color: "#FFFFFF", isOriginalBadge: true },
      { name: "HTML5", level: "Core", icon: SiHtml5, color: "#E34F26", isOriginalBadge: false },
      { name: "CSS3", level: "Core", icon: SiCss, color: "#1572B6", isOriginalBadge: false },
    ],
  },
  {
    id: "backend",
    title: "Backend & Database",
    description: "Scalable server-side logic, relational schemas, and RESTful APIs.",
    items: [
      { name: "Node.js", level: "Core", icon: SiNodedotjs, color: "#5FA04E", isOriginalBadge: true },
      { name: "Laravel", level: "Core", icon: SiLaravel, color: "#FF2D20", isOriginalBadge: true },
      { name: "Python", level: "Proficient", icon: SiPython, color: "#3776AB", isOriginalBadge: true },
      { name: "Express", level: "Proficient", icon: SiExpress, color: "#FFFFFF", isOriginalBadge: true },
      { name: "MySQL", level: "Proficient", icon: SiMysql, color: "#4479A1", isOriginalBadge: true },
      { name: "PostgreSQL", level: "Proficient", icon: SiPostgresql, color: "#4169E1", isOriginalBadge: false },
      { name: "MongoDB", level: "Familiar", icon: SiMongodb, color: "#47A248", isOriginalBadge: true },
    ],
  },
  {
    id: "architecture",
    title: "Architecture & Protocols",
    description: "System design patterns, API integrations, and networking fundamentals.",
    items: [
      { name: "REST APIs", level: "Core", icon: LuNetwork, color: "#22D3EE", isOriginalBadge: false },
      { name: "GraphQL", level: "Familiar", icon: SiGraphql, color: "#E10098", isOriginalBadge: true },
      { name: "Docker", level: "Proficient", icon: SiDocker, color: "#2496ED", isOriginalBadge: true },
    ],
  },
  {
    id: "tools",
    title: "Tooling & Workflow",
    description: "Version control, containerization, and interface prototyping.",
    items: [
      { name: "Git", level: "Core", icon: SiGit, color: "#F05032", isOriginalBadge: true },
      { name: "Figma", level: "Proficient", icon: SiFigma, color: "#F24E1E", isOriginalBadge: true },
    ],
  },
];
