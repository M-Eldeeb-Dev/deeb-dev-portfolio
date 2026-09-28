import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const outputPath = path.join(rootDir, "public", "og-image.png");

async function generateSocialCard() {
  const width = 1200;
  const height = 630;

  const svgCard = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#080B11"/>
        <stop offset="50%" stop-color="#0D111A"/>
        <stop offset="100%" stop-color="#080B11"/>
      </linearGradient>
      <radialGradient id="glowViolet" cx="0.85" cy="0.15" r="0.6">
        <stop offset="0%" stop-color="#8B5CF6" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#8B5CF6" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="glowCyan" cx="0.15" cy="0.85" r="0.6">
        <stop offset="0%" stop-color="#06B6D4" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#06B6D4" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="textGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="100%" stop-color="#C4B5FD"/>
      </linearGradient>
    </defs>

    <!-- Backgrounds -->
    <rect width="${width}" height="${height}" fill="url(#bg)"/>
    <rect width="${width}" height="${height}" fill="url(#glowViolet)"/>
    <rect width="${width}" height="${height}" fill="url(#glowCyan)"/>

    <!-- Subtle Border -->
    <rect x="24" y="24" width="${width - 48}" height="${height - 48}" rx="24" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>

    <!-- Status Pill -->
    <g transform="translate(80, 80)">
      <rect width="260" height="40" rx="20" fill="rgba(13,17,26,0.8)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
      <circle cx="24" cy="20" r="5" fill="#22C55E"/>
      <text x="40" y="25" fill="#E2E8F0" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" letter-spacing="0.5">OPEN FOR WORK</text>
    </g>

    <!-- Main Typography -->
    <text x="80" y="240" fill="url(#textGrad)" font-family="system-ui, -apple-system, sans-serif" font-size="68" font-weight="800" letter-spacing="-1">Mohamed Eldeeb</text>
    <text x="80" y="310" fill="#22D3EE" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="600" letter-spacing="1">Full-Stack Software Engineer</text>
    
    <text x="80" y="380" fill="#94A3B8" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="400">
      React · TypeScript · Node.js · Laravel · Python · Scalable Web Architectures
    </text>

    <!-- Footer Bar -->
    <g transform="translate(80, 520)">
      <text x="0" y="0" fill="#64748B" font-family="monospace" font-size="18">https://deeb.is-a.dev</text>
      <text x="800" y="0" fill="#A78BFA" font-family="monospace" font-size="18">github.com/M-Eldeeb-Dev</text>
    </g>
  </svg>
  `;

  await sharp(Buffer.from(svgCard))
    .png({ quality: 90, compressionLevel: 9 })
    .toFile(outputPath);

  const stat = await sharp(outputPath).metadata();
  console.log(`✓ Generated social card at ${outputPath} (${width}x${height})`);
}

generateSocialCard().catch((err) => {
  console.error("Failed to generate social card:", err);
  process.exit(1);
});
