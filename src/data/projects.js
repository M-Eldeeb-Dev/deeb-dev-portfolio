import elevvoWebp from "../assets/projects/elevvo.webp";
import elevvoAvif from "../assets/projects/elevvo.avif";
import weatherDashboardWebp from "../assets/projects/weather-dashboard.webp";
import weatherDashboardAvif from "../assets/projects/weather-dashboard.avif";
import rabetWebp from "../assets/projects/rabet.webp";
import rabetAvif from "../assets/projects/rabet.avif";
import deepifyWebp from "../assets/projects/deepify.webp";
import deepifyAvif from "../assets/projects/deepify.avif";

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
    id: "rabet-platform",
    title: "Rabet Platform",
    category: "Full-Stack",
    kind: "Personal",
    summary:
      "A platform designed to bridge the gap between visionary Entrepreneurs and talented Co-Founders.",
    outcome:
      "collaborative ecosystem where ideas meet execution, supported by Event Managers and overseen by Admins.",
    stack: ["React", "JavaScript", "Tailwind CSS", "Supabase API"],
    links: {
      live: "https://rabet-platform.vercel.app/",
      repo: "https://github.com/M-Eldeeb-Dev/Rabet-Platform",
    },
    image: {
      webp: rabetWebp,
      avif: rabetAvif,
      alt: "Rabet Platform interface preview",
      width: 800,
      height: 786,
    },
  },
  {
    id: "deepify-ecommerce",
    title: "Deepify E-Commerce",
    category: "Full-Stack",
    kind: "Personal",
    summary:
      "Modern, premium e-commerce platform with product catalogs, filtering, and responsive shopping cart.",
    outcome:
      "Full-featured shopping storefront with dynamic catalog browsing, stateful cart management, and scalable component structure.",
    stack: ["Laravel", "Tailwind CSS", "JavaScript", "ORM Database"],
    links: {
      live: null,
      repo: "https://github.com/M-Eldeeb-Dev/deepify-ecommerce",
    },
    image: {
      webp: deepifyWebp,
      avif: deepifyAvif,
      alt: "Deepify E-Commerce storefront preview",
      width: 800,
      height: 401,
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
      width: 800,
      height: 331,
    },
  },
  {
    id: "aerocast-platform",
    title: "AeroCast Platform",
    category: "API / Systems",
    kind: "Personal",
    summary: "Weather insights platform with cards and multi-day forecasts.",
    outcome:
      "Real-time OpenWeather API integration delivering multi-day forecasts and location search.",
    stack: ["JavaScript", "REST APIs", "CSS3", "Async/Await"],
    links: {
      live: "https://aero-cast-eight.vercel.app/",
      repo: "https://github.com/M-Eldeeb-Dev/AeroCast-Platform",
    },
    image: {
      webp: weatherDashboardWebp,
      avif: weatherDashboardAvif,
      alt: "Weather App Dashboard with weather cards and search",
      width: 800,
      height: 357,
    },
  },
];

export const projectCategories = [
  "All",
  "Full-Stack",
  "Frontend",
  "API / Systems",
];

