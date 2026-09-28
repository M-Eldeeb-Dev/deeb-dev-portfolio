import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const srcAssetsDir = path.join(rootDir, "assets-src");
const destAssetsDir = path.join(rootDir, "src", "assets");
const destProjectsDir = path.join(destAssetsDir, "projects");

async function ensureDirs() {
  await fs.mkdir(destAssetsDir, { recursive: true });
  await fs.mkdir(destProjectsDir, { recursive: true });
}

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function processImage({ inputPath, outputBase, width, height = null, fit = "inside", generatePng = false }) {
  const statBefore = await fs.stat(inputPath);
  const inputFilename = path.basename(inputPath);

  // Generate WebP
  const webpPath = `${outputBase}.webp`;
  let webpPipeline = sharp(inputPath);
  if (width || height) {
    webpPipeline = webpPipeline.resize(width, height, { fit, withoutEnlargement: true });
  }
  await webpPipeline.webp({ quality: 80, effort: 6 }).toFile(webpPath);
  const webpStat = await fs.stat(webpPath);

  // Generate AVIF
  const avifPath = `${outputBase}.avif`;
  let avifPipeline = sharp(inputPath);
  if (width || height) {
    avifPipeline = avifPipeline.resize(width, height, { fit, withoutEnlargement: true });
  }
  await avifPipeline.avif({ quality: 65, effort: 6 }).toFile(avifPath);
  const avifStat = await fs.stat(avifPath);

  console.log(`✓ ${inputFilename}:`);
  console.log(`   Original: ${formatBytes(statBefore.size)}`);
  console.log(`   WebP:     ${formatBytes(webpStat.size)} -> ${path.relative(rootDir, webpPath)}`);
  console.log(`   AVIF:     ${formatBytes(avifStat.size)} -> ${path.relative(rootDir, avifPath)}`);

  // Generate PNG if requested
  if (generatePng) {
    const pngPath = `${outputBase}.png`;
    let pngPipeline = sharp(inputPath);
    if (width || height) {
      pngPipeline = pngPipeline.resize(width, height, { fit, withoutEnlargement: true });
    }
    await pngPipeline.png({ compressionLevel: 9 }).toFile(pngPath);
    const pngStat = await fs.stat(pngPath);
    console.log(`   PNG:      ${formatBytes(pngStat.size)} -> ${path.relative(rootDir, pngPath)}`);
  }
}

async function run() {
  console.log("== Starting Portfolio Asset Optimization ==");
  await ensureDirs();

  // 1. Avatar (Square crop, max 600x600)
  let avatarSrc = path.join(srcAssetsDir, "me.webp");
  try {
    await fs.access(avatarSrc);
  } catch {
    avatarSrc = path.join(srcAssetsDir, "me.png");
  }

  try {
    await fs.access(avatarSrc);
    const meta = await sharp(avatarSrc).metadata();
    
    // Headshot Framing:
    // Face is between y=30 and y=210, center x is ~314 (out of 648x765)
    // Extract a 460x460 region focusing on the headshot and shoulders,
    // and add 40px top padding so the circular border doesn't clip the hair
    const cropWidth = Math.min(460, meta.width);
    const cropHeight = Math.min(460, meta.height);
    const cropLeft = Math.max(0, Math.min(meta.width - cropWidth, Math.round(meta.width / 2 - cropWidth / 2)));
    const cropTop = 0;

    const basePipeline = sharp(avatarSrc)
      .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
      .extend({ top: 40, bottom: 0, left: 0, right: 0, background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .resize(600, 600, { fit: "cover" });

    const avatarBase = path.join(destAssetsDir, "me");

    // WebP
    await basePipeline.clone().webp({ quality: 85, effort: 6 }).toFile(`${avatarBase}.webp`);
    // AVIF
    await basePipeline.clone().avif({ quality: 70, effort: 6 }).toFile(`${avatarBase}.avif`);
    // PNG
    await basePipeline.clone().png({ compressionLevel: 9 }).toFile(`${avatarBase}.png`);

    console.log("✓ Avatar successfully optimized with tailored headshot framing!");
  } catch (err) {
    console.warn(`[WARN] Avatar source processing error at ${avatarSrc}: ${err.message}`);
  }

  // 2. Project Images (max width 1200, preserve aspect ratio)
  const projectFiles = [
    { src: "Security-Website.webp", out: "security-website" },
    { src: "Advanced-Dashbaord.webp", out: "advanced-dashboard" },
    { src: "Modern-Porfolio.webp", out: "modern-portfolio" },
    { src: "Auto-Parts.webp", out: "auto-parts" },
    { src: "Weather-Dashboard.webp", out: "weather-dashboard" },
    { src: "Elevvo.webp", out: "elevvo" },
  ];

  for (const { src, out } of projectFiles) {
    const inputPath = path.join(srcAssetsDir, src);
    try {
      await fs.access(inputPath);
      await processImage({
        inputPath,
        outputBase: path.join(destProjectsDir, out),
        width: 1200,
      });
    } catch (err) {
      console.warn(`[WARN] Project source not found at ${inputPath}: ${err.message}`);
    }
  }

  console.log("== Asset Optimization Complete ==");
}

run().catch((err) => {
  console.error("Optimization failed:", err);
  process.exit(1);
});
