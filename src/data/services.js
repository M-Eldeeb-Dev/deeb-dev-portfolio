/**
 * @typedef {Object} ServiceItem
 * @property {string} id - Unique identifier
 * @property {string} title - Service title with emoji
 * @property {string} desc - Service deliverable description
 * @property {string} iconKey - Logical icon key
 */

/** @type {ServiceItem[]} */
export const services = [
  {
    id: "web-dev",
    title: "Web Development 🌐",
    desc: "Fast, accessible, and SEO-ready websites.",
    iconKey: "web",
  },
  {
    id: "apps",
    title: "Applications 📱",
    desc: "Cross-platform apps with native feel.",
    iconKey: "mobile",
  },
  {
    id: "ui-ux",
    title: "UI/UX Design 🎨",
    desc: "Modern interfaces with thoughtful interactions.",
    iconKey: "design",
  },
];
