import advancedDashboardWebp from "../assets/projects/advanced-dashboard.webp";
import advancedDashboardAvif from "../assets/projects/advanced-dashboard.avif";
import autoPartsWebp from "../assets/projects/auto-parts.webp";
import autoPartsAvif from "../assets/projects/auto-parts.avif";
import elevvoWebp from "../assets/projects/elevvo.webp";
import elevvoAvif from "../assets/projects/elevvo.avif";
import modernPortfolioWebp from "../assets/projects/modern-portfolio.webp";
import modernPortfolioAvif from "../assets/projects/modern-portfolio.avif";
import securityWebsiteWebp from "../assets/projects/security-website.webp";
import securityWebsiteAvif from "../assets/projects/security-website.avif";
import weatherDashboardWebp from "../assets/projects/weather-dashboard.webp";
import weatherDashboardAvif from "../assets/projects/weather-dashboard.avif";

/**
 * @typedef {Object} ProjectImage
 * @property {string} webp - WebP asset source
 * @property {string} avif - AVIF asset source
 * @property {string} alt - Accessible description
 * @property {number} width - Intrinsic width
 * @property {number} height - Intrinsic height
 */

/**
 * @typedef {Object} ProjectLinks
 * @property {string|null} live - Live demo URL
 * @property {string|null} repo - GitHub repository URL
 */

/**
 * @typedef {Object} Project
 * @property {string} id - Unique slug
 * @property {string} title - Project title
 * @property {"Full-Stack" | "Frontend" | "API / Systems"} category - Primary filter category
 * @property {"Personal" | "Freelance" | "Internship" | "Open-source"} kind - Project context
 * @property {string} summary - Short project description
 * @property {string} outcome - Demonstrable capability and technical deliverable
 * @property {string[]} stack - Technologies used
 * @property {ProjectLinks} links - Action links
 * @property {ProjectImage} image - Image asset data
 */

/** @type {Project[]} */
export const projects = [
  {
    id: "berimbolo-security",
    title: "Berimbolo Security Website",
    category: "Full-Stack",
    kind: "Freelance",
    summary:
      "Responsive multi-section security services site with modern animations.",
    outcome:
      "Deployed production multi-section architecture with interactive customer inquiry flows.",
    stack: ["React", "Tailwind CSS", "JavaScript", "Responsive Design"],
    links: {
      live: "https://M-Eldeeb-Dev.github.io/Berimbolo-Security-Website/",
      repo: "https://github.com/M-Eldeeb-Dev/Berimbolo-Security-Website",
    },
    image: {
      webp: securityWebsiteWebp,
      avif: securityWebsiteAvif,
      alt: "Berimbolo Security Website interface showcase",
      width: 1200,
      height: 534,
    },
  },
  {
    id: "advanced-admin-dashboard",
    title: "Advanced Admin Dashboard",
    category: "Frontend",
    kind: "Personal",
    summary: "Data-rich dashboard UI with charts, tables, and dark theme.",
    outcome:
      "Full data visualization interface with dynamic chart feeds, sortable data tables, and dark theme.",
    stack: ["React", "JavaScript", "Charts", "Tailwind CSS"],
    links: {
      live: "https://M-Eldeeb-Dev.github.io/Advanced_DashBoard/",
      repo: "https://github.com/M-Eldeeb-Dev/Advanced_DashBoard",
    },
    image: {
      webp: advancedDashboardWebp,
      avif: advancedDashboardAvif,
      alt: "Advanced Admin Dashboard with charts and dark UI",
      width: 1200,
      height: 675,
    },
  },
  {
    id: "modern-personal-portfolio",
    title: "Modern Personal Portfolio",
    category: "Frontend",
    kind: "Personal",
    summary:
      "Futuristic portfolio with smooth scroll, animations, and contact form.",
    outcome:
      "Single-page responsive showcase with custom canvas particle network and interactive forms.",
    stack: ["React", "Tailwind CSS", "Canvas API", "Vite"],
    links: {
      live: "https://M-Eldeeb-Dev.github.io/Modern-Portfolio/",
      repo: "https://github.com/M-Eldeeb-Dev/Modern-Portfolio",
    },
    image: {
      webp: modernPortfolioWebp,
      avif: modernPortfolioAvif,
      alt: "Modern Personal Portfolio showcase interface",
      width: 1200,
      height: 534,
    },
  },
  {
    id: "auto-parts-landing",
    title: "Auto Parts Landing",
    category: "Frontend",
    kind: "Freelance",
    summary: "Landing page for auto parts store with product highlights.",
    outcome:
      "Optimized commercial storefront landing with category browsing and call-to-actions.",
    stack: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
    links: {
      live: "https://M-Eldeeb-Dev.github.io/Auto-Parts-Project/",
      repo: "https://github.com/M-Eldeeb-Dev/Auto-Parts-Project",
    },
    image: {
      webp: autoPartsWebp,
      avif: autoPartsAvif,
      alt: "Auto Parts E-Commerce Landing page preview",
      width: 1200,
      height: 515,
    },
  },
  {
    id: "weather-app-dashboard",
    title: "Weather App Dashboard",
    category: "API / Systems",
    kind: "Personal",
    summary: "Weather insights dashboard with cards and city search.",
    outcome:
      "Real-time OpenWeather API integration delivering multi-day forecasts and location search.",
    stack: ["JavaScript", "REST APIs", "CSS3", "Async/Await"],
    links: {
      live: "https://M-Eldeeb-Dev.github.io/Weather-App-Dashboard/",
      repo: "https://github.com/M-Eldeeb-Dev/Weather-App-Dashboard",
    },
    image: {
      webp: weatherDashboardWebp,
      avif: weatherDashboardAvif,
      alt: "Weather App Dashboard with weather cards and search",
      width: 1200,
      height: 536,
    },
  },
  {
    id: "elevvo-internship-frontend",
    title: "Elevvo Internship Frontend",
    category: "Frontend",
    kind: "Internship",
    summary:
      "Internship work: React pages, API integration, and UI polishing.",
    outcome:
      "Delivered enterprise React components, API integration pipelines, and accessible UI polish.",
    stack: ["React", "REST APIs", "Tailwind CSS", "Component Architecture"],
    links: {
      live: null,
      repo: "https://github.com/M-Eldeeb-Dev/Elevvo-Internship-Frontend",
    },
    image: {
      webp: elevvoWebp,
      avif: elevvoAvif,
      alt: "Elevvo Internship enterprise frontend showcase",
      width: 1200,
      height: 497,
    },
  },
];

export const projectCategories = [
  "All",
  "Full-Stack",
  "Frontend",
  "API / Systems",
];
