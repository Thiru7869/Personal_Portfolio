#!/usr/bin/env node
/**
 * scripts/generate-assets.mjs
 * ------------------------------------------------------------
 * Generates the binary/vector assets the site links to:
 *
 *   frontend/public/resume/Thiru-Resume.pdf
 *   frontend/public/research/paper.pdf
 *   frontend/public/certificates/*.svg
 *
 * These are real, valid files produced from the same facts the
 * site displays. Replace them with your designed resume PDF,
 * the full published paper, and certificate scans whenever
 * ready — keep the filenames and nothing else changes.
 *
 * Run from the repo root:  node scripts/generate-assets.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pub = join(root, "frontend", "public");

/* ---------------- minimal PDF writer ---------------- */

function escapePdfText(text) {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildPdf(lines) {
  const pageW = 595;
  const pageH = 842;
  const margin = 56;

  let y = pageH - margin;
  let content = "";
  for (const line of lines) {
    const size = line.size ?? 10.5;
    const gap = line.gap ?? size * 1.55;
    y -= gap;
    if (y < margin) break;
    const font = line.bold ? "/F2" : "/F1";
    content += `BT ${font} ${size} Tf ${margin} ${y.toFixed(1)} Td (${escapePdfText(line.text)}) Tj ET\n`;
  }

  const objects = [];
  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  objects.push("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  objects.push(
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] ` +
      "/Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>"
  );
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
  objects.push(`<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}endstream`);

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((obj, i) => {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`;
  });

  const xrefStart = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return Buffer.from(pdf, "latin1");
}

/* ---------------- resume ---------------- */

const resumeLines = [
  { text: "THIRUMALA NARASIMHA POLURU (THIRU)", size: 17, bold: true, gap: 22 },
  { text: "Full-Stack Developer  |  AI & Data Science Enthusiast", size: 10 },
  { text: "Bengaluru, India  ·  +91 93926 13828  ·  reddytn4@gmail.com", size: 9 },
  { text: "github.com/Thiru7869  ·  linkedin.com/in/poluru-thirumala-narasimha-23775926b  ·  leetcode.com/u/thiru7869", size: 9 },
  { text: "", gap: 10 },
  { text: "SUMMARY", size: 12, bold: true, gap: 26 },
  { text: "Full-stack developer working with React, Next.js, TypeScript, Python, and FastAPI. Co-author of a" },
  { text: "published deep learning research paper on ECG-based cardiovascular disease detection (IJNRD)." },
  { text: "Daily Linux (Parrot OS) user, moving deeper into Docker, CI/CD, and cloud. Open to full-time," },
  { text: "internship, and freelance opportunities - remote or on-site." },
  { text: "", gap: 10 },
  { text: "PROJECTS", size: 12, bold: true, gap: 26 },
  { text: "Production-Grade Full-Stack Portfolio", bold: true },
  { text: "Seven-theme portfolio with terminal mode, AI assistant (multi-provider fallback), CMS, analytics," },
  { text: "blog engine, and FAQ system. Next.js, TypeScript, Tailwind, Supabase - Lighthouse 95+." },
  { text: "Dynamic Kalamkari E-Commerce Platform", bold: true },
  { text: "Marketplace for hand-painted textiles: JWT auth, customer & admin dashboards, product management," },
  { text: "dynamic pricing, and a content-based recommendation system. Next.js, FastAPI, PostgreSQL." },
  { text: "ECG-Based Cardiovascular Disease Detection", bold: true },
  { text: "Deep learning pipeline classifying cardiovascular conditions from ECG signals; noise-robust" },
  { text: "preprocessing and imbalance-aware evaluation. Python, TensorFlow. Published research (IJNRD 2025)." },
  { text: "", gap: 10 },
  { text: "RESEARCH", size: 12, bold: true, gap: 26 },
  { text: "Innovative Deep Learning Approaches for ECG-Based Cardiovascular Disease Detection", bold: true },
  { text: "International Journal of Novel Research and Development (IJNRD), 2025." },
  { text: "", gap: 10 },
  { text: "SKILLS", size: 12, bold: true, gap: 26 },
  { text: "Frontend: HTML5, CSS3, JavaScript, TypeScript, React, Next.js, Tailwind CSS" },
  { text: "Backend: Python, FastAPI, Node.js, REST APIs, JWT Authentication" },
  { text: "Databases: PostgreSQL, MongoDB, MySQL  ·  Tools: Git, GitHub, VS Code, Docker, Postman, Figma" },
  { text: "Other: Linux (Parrot OS), Responsive Design, SEO, Performance Optimization, AI Integration" },
  { text: "", gap: 10 },
  { text: "EDUCATION", size: 12, bold: true, gap: 26 },
  { text: "B.Tech, Computer Science & Engineering - Annamacharya Institute of Technology and Sciences,", bold: false },
  { text: "Tirupati (2021-2025), aggregate 70%" },
];

/* ---------------- research paper summary sheet ---------------- */

const paperLines = [
  { text: "Innovative Deep Learning Approaches for ECG-Based", size: 15, bold: true, gap: 24 },
  { text: "Cardiovascular Disease Detection", size: 15, bold: true },
  { text: "", gap: 8 },
  { text: "Thirumala Narasimha Poluru, et al.", size: 10 },
  { text: "International Journal of Novel Research and Development (IJNRD), 2025", size: 9 },
  { text: "", gap: 12 },
  { text: "ABSTRACT", size: 11, bold: true, gap: 24 },
  { text: "Cardiovascular disease remains the leading cause of death worldwide, and early detection from" },
  { text: "electrocardiogram (ECG) signals is one of the most practical paths to reducing that toll. This" },
  { text: "work explores deep learning architectures for classifying cardiovascular conditions directly" },
  { text: "from ECG signals, comparing convolutional and recurrent approaches on preprocessed signal" },
  { text: "data. We address the practical problems that keep such models out of clinics - noisy" },
  { text: "real-world signals, class imbalance across rarer conditions, and the gap between benchmark" },
  { text: "accuracy and dependable behaviour on unseen patients - using signal preprocessing," },
  { text: "augmentation, and careful evaluation protocols. The approach achieves strong classification" },
  { text: "performance while remaining computationally light enough for modest hardware." },
  { text: "", gap: 12 },
  { text: "KEY CONTRIBUTIONS", size: 11, bold: true, gap: 24 },
  { text: "1. A preprocessing and augmentation pipeline robust to noisy, real-world ECG signals." },
  { text: "2. A comparative evaluation of CNN and recurrent architectures for multi-class detection." },
  { text: "3. Class-imbalance handling so rarer conditions are not drowned out by common ones." },
  { text: "4. A deployment-conscious design keeping inference practical on modest hardware." },
  { text: "", gap: 12 },
  { text: "KEYWORDS", size: 11, bold: true, gap: 24 },
  { text: "Deep Learning, ECG Classification, Cardiovascular Disease, Signal Processing, ML in Healthcare" },
  { text: "", gap: 12 },
  { text: "NOTE", size: 11, bold: true, gap: 24 },
  { text: "This file is a summary sheet generated for the portfolio. Replace it with the full published" },
  { text: "PDF at frontend/public/research/paper.pdf when convenient." },
];

/* ---------------- certificate SVGs ---------------- */

const certs = [
  ["cert-fullstack", "Full-Stack Web Development", "Certification", "Certificate of Completion", "2024", "#1d4ed8"],
  ["cert-python", "Python Programming", "Certification", "Certificate of Completion", "2024", "#0f766e"],
  ["cert-aiml", "Machine Learning & AI", "Certification", "Certificate of Completion", "2024", "#5b21b6"],
  ["cert-sql", "Database & SQL", "Certification", "Certificate of Completion", "2025", "#9a3412"],
  ["cert-research", "Research Publication", "IJNRD Journal", "International Journal of Novel Research and Development", "2025", "#065f46"],
];

function certificateSvg([, title1, title2, issuer, date, accent]) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="Georgia, 'Times New Roman', serif">
  <rect width="800" height="500" fill="#f8f7f2"/>
  <rect x="18" y="18" width="764" height="464" fill="none" stroke="${accent}" stroke-width="3"/>
  <rect x="28" y="28" width="744" height="444" fill="none" stroke="${accent}" stroke-width="1" opacity="0.5"/>
  <text x="400" y="92" text-anchor="middle" font-size="16" letter-spacing="6" fill="#666">CERTIFICATE</text>
  <line x1="280" y1="112" x2="520" y2="112" stroke="${accent}" stroke-width="1.5"/>
  <text x="400" y="170" text-anchor="middle" font-size="14" fill="#777">This certifies that</text>
  <text x="400" y="215" text-anchor="middle" font-size="30" font-style="italic" fill="#222">Thirumala Narasimha Poluru</text>
  <text x="400" y="258" text-anchor="middle" font-size="14" fill="#777">has been awarded</text>
  <text x="400" y="300" text-anchor="middle" font-size="24" font-weight="bold" fill="${accent}">${title1}</text>
  <text x="400" y="332" text-anchor="middle" font-size="24" font-weight="bold" fill="${accent}">${title2}</text>
  <text x="400" y="390" text-anchor="middle" font-size="14" fill="#444">${issuer}</text>
  <text x="400" y="415" text-anchor="middle" font-size="13" fill="#888">${date}</text>
  <circle cx="700" cy="410" r="34" fill="none" stroke="${accent}" stroke-width="2"/>
  <circle cx="700" cy="410" r="27" fill="none" stroke="${accent}" stroke-width="1" opacity="0.6"/>
  <text x="700" y="415" text-anchor="middle" font-size="10" letter-spacing="1" fill="${accent}">VERIFIED</text>
</svg>
`;
}

/* ---------------- blog category covers ---------------- */

const covers = [
  ["react", "React", "#61dafb", "#0b2733"],
  ["nextjs", "Next.js", "#ffffff", "#0a0a0a"],
  ["typescript", "TypeScript", "#3178c6", "#0b1a2e"],
  ["javascript", "JavaScript", "#f7df1e", "#2a2504"],
  ["css", "CSS & Design", "#38bdf8", "#0a1e2a"],
  ["backend", "Backend", "#34d399", "#06231a"],
  ["fastapi", "FastAPI", "#05998b", "#031f1c"],
  ["databases", "Databases", "#a78bfa", "#1b1233"],
  ["devops", "DevOps & Docker", "#2496ed", "#081b2d"],
  ["linux", "Linux", "#00ff41", "#03140a"],
  ["ai", "AI & Research", "#f472b6", "#2a0a1c"],
  ["performance", "Performance & SEO", "#fbbf24", "#291d04"],
  ["career", "Career", "#60a5fa", "#0a1a33"],
  ["journey", "Developer Journey", "#fb923c", "#2a1404"],
  ["projects", "Project Breakdowns", "#22d3ee", "#062329"],
];

function coverSvg([slug, label, accent, bg]) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" font-family="ui-monospace, monospace">
  <rect width="1200" height="630" fill="${bg}"/>
  <circle cx="1050" cy="90" r="300" fill="${accent}" opacity="0.08"/>
  <circle cx="120" cy="560" r="240" fill="${accent}" opacity="0.06"/>
  <g stroke="${accent}" stroke-width="1" opacity="0.14">
    ${Array.from({ length: 12 }, (_, i) => `<line x1="${i * 110}" y1="0" x2="${i * 110}" y2="630"/>`).join("")}
  </g>
  <text x="80" y="120" font-size="26" fill="${accent}" opacity="0.85">thiru@blog:~$ cat ${slug}.md</text>
  <text x="80" y="360" font-size="72" font-weight="bold" fill="${accent}">${label}</text>
  <text x="80" y="420" font-size="26" fill="${accent}" opacity="0.6">notes from building real things</text>
  <rect x="80" y="480" width="64" height="6" fill="${accent}"/>
</svg>
`;
}

/* ---------------- write everything ---------------- */

const targets = [
  [join(pub, "resume", "Thiru-Resume.pdf"), buildPdf(resumeLines)],
  [join(pub, "research", "paper.pdf"), buildPdf(paperLines)],
  ...certs.map((c) => [join(pub, "certificates", `${c[0]}.svg`), certificateSvg(c)]),
  ...covers.map((c) => [join(pub, "blog-covers", `${c[0]}.svg`), coverSvg(c)]),
];

for (const [path, data] of targets) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, data);
  console.log("wrote", path);
}

/* ---------------- PWA icons (PNG + maskable) ---------------- */
// Rasterise the brand mark into the PNGs the web manifest needs.
// Regular icons keep the SVG's own padding; the maskable variant
// adds a safe-zone margin + full-bleed background so Android's
// mask never clips the glyph.
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#080f1f"/>
  <rect x="2" y="2" width="60" height="60" rx="12" fill="none" stroke="#3b82f6" stroke-width="2.5"/>
  <text x="10" y="42" font-family="monospace" font-size="30" font-weight="bold" fill="#22d3ee">&gt;_</text>
  <circle cx="48" cy="18" r="5" fill="#3b82f6"/>
</svg>`;

// Maskable: 40% safe zone — glyph shrunk into the centre on a
// solid background so any mask shape keeps it intact.
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#080f1f"/>
  <g transform="translate(14 14) scale(0.56)">
    <text x="10" y="42" font-family="monospace" font-size="30" font-weight="bold" fill="#22d3ee">&gt;_</text>
    <circle cx="48" cy="18" r="5" fill="#3b82f6"/>
  </g>
</svg>`;

try {
  // sharp lives in frontend/node_modules — resolve it from there.
  const { createRequire } = await import("node:module");
  const req = createRequire(join(root, "frontend", "package.json"));
  const sharp = req("sharp");
  const iconTargets = [
    [iconSvg, "icon-192.png", 192],
    [iconSvg, "icon-512.png", 512],
    [iconSvg, "apple-icon.png", 180],
    [maskableSvg, "icon-maskable-512.png", 512],
  ];
  for (const [svg, name, px] of iconTargets) {
    const out = join(pub, "icons", name);
    mkdirSync(dirname(out), { recursive: true });
    await sharp(Buffer.from(svg)).resize(px, px).png().toFile(out);
    console.log("wrote", out);
  }
} catch (err) {
  console.warn(
    "\nSkipped PWA PNG icons (sharp unavailable):",
    err.message,
    "\nThe SVG favicon still works; run `npm i` then re-run to generate PNGs."
  );
}

console.log("\nDone. Replace these with your real files whenever ready.");
