import type { NextConfig } from "next";

/**
 * Content Security Policy.
 * ------------------------------------------------------------
 * Every directive is scoped to exactly what the app needs:
 *   - script-src / style-src allow 'unsafe-inline'. This is a
 *     deliberate trade-off: the theme-init script, JSON-LD, GA,
 *     and Next.js's own hydration scripts are inline, and a
 *     nonce-based CSP would force every page into dynamic
 *     rendering — losing the static generation that keeps
 *     Lighthouse high. object-src 'none' + base-uri 'self' +
 *     frame-ancestors 'self' still block the most dangerous
 *     injection vectors.
 *   - The AI providers, Supabase, and email are called SERVER-
 *     side (through same-origin /api routes), so the browser
 *     only needs 'self' in connect-src plus the analytics beacons.
 *   - img-src allows the GitHub/LeetCode stat-card hosts and
 *     Cloudinary; frame-src allows the Google Maps embed and the
 *     Google Drive preview iframe (Terminal mode's Resume window).
 * Adjust here if you add a new external script/media/frame host.
 */
// `next dev` compiles with an eval-based runtime (React Refresh +
// webpack HMR over a websocket), so development needs 'unsafe-eval'
// and ws: in connect-src. Production uses neither — it keeps the
// strict policy below. Gating by NODE_ENV means local dev actually
// hydrates while the deployed site stays locked down.
const isDev = process.env.NODE_ENV !== "production";

const scriptSrc = [
  "script-src 'self' 'unsafe-inline'",
  "https://www.googletagmanager.com",
  "https://va.vercel-scripts.com",
  ...(isDev ? ["'unsafe-eval'"] : []),
].join(" ");

const connectSrc = [
  "connect-src 'self'",
  "https://va.vercel-scripts.com",
  "https://www.google-analytics.com",
  "https://*.google-analytics.com",
  "https://www.googletagmanager.com",
  ...(isDev ? ["ws:", "wss:"] : []),
].join(" ");

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  scriptSrc,
  connectSrc,
  "frame-src 'self' https://www.google.com https://drive.google.com",
  "worker-src 'self' blob:",
  // upgrade-insecure-requests would rewrite http://localhost in dev.
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

/**
 * Security headers applied to every response.
 */
const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Cloudinary is the image/asset host. Add more hosts here if needed.
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
