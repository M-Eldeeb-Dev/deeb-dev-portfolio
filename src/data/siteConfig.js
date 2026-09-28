/**
 * @typedef {Object} NavItem
 * @property {string} id - Unique identifier matching the section anchor
 * @property {string} label - Human-readable label
 * @property {string} href - Target anchor href
 */

/**
 * @typedef {Object} SocialLink
 * @property {string} name - Platform name
 * @property {string} url - Target profile URL
 * @property {string} icon - React icon identifier key
 * @property {string} [handle] - Visible display handle
 */

/**
 * @typedef {Object} SiteConfig
 * @property {string} name - Developer full name
 * @property {string} shortName - Nickname / logo mark
 * @property {string} title - Professional headline
 * @property {string} role - Current role focus
 * @property {string} bio - Short biographical summary
 * @property {string} siteUrl - Production canonical origin
 * @property {string} email - Primary contact email
 * @property {Object} status - Availability badge config
 * @property {string} status.label - Display text
 * @property {boolean} status.available - Current availability flag
 * @property {NavItem[]} navItems - Navigation links
 * @property {SocialLink[]} socials - Social channels
 * @property {Object} resume - Resume document paths
 * @property {string} resume.localPath - In-app PDF path in /public
 * @property {string} resume.externalUrl - Remote cloud fallback
 * @property {string} resume.filename - Download filename
 */

/** @type {SiteConfig} */
export const siteConfig = {
  name: "Mohamed Eldeeb",
  shortName: "Deeb",
  title: "Full-Stack Software Engineer",
  role: "Full-Stack Web Developer & Scalable Systems Enthusiast",
  bio: "I craft high-performance web applications with a focus on clean design, solid architecture, and scalability. Passionate about developer experience, accessible user interfaces, and robust server-side APIs.",
  siteUrl: "https://deeb.is-a.dev",
  email: "mo6942853@gmail.com",
  status: {
    label: "Open for Work / Freelance",
    available: true,
  },
  resume: {
    localPath: "/resume/Mohamed-Eldeeb-(CV).pdf",
    externalUrl: "https://drive.google.com/file/d/1K6fz8KAlzqIr-rbiL5t_QroU4qgqpUdE/view?usp=drive_link",
    filename: "Mohamed-Eldeeb-Resume.pdf",
  },
  navItems: [
    { id: "hero", label: "Home", href: "#hero" },
    { id: "skills", label: "Skills", href: "#skills" },
    { id: "projects", label: "Projects", href: "#projects" },
    { id: "services", label: "Services", href: "#services" },
    { id: "experience", label: "Certificates", href: "#experience" },
    { id: "contact", label: "Contact", href: "#contact" },
  ],
  socials: [
    {
      name: "GitHub",
      url: "https://github.com/M-Eldeeb-Dev",
      icon: "SiGithub",
      handle: "M-Eldeeb-Dev",
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/mohamed-eldeeb-78b83730b",
      icon: "SiLinkedin",
      handle: "mohamed-eldeeb",
    },
    {
      name: "Email",
      url: "mailto:mo6942853@gmail.com",
      icon: "LuMail",
      handle: "mo6942853@gmail.com",
    },
  ],
};
