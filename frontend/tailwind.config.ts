import type { Config } from "tailwindcss";

/**
 * Tailwind scales are mapped onto theme CSS variables, so the
 * seven UI modes restyle geometry (rounded-*), typography
 * (font-*), and depth (shadow-*) everywhere — with zero
 * per-component conditionals. Tokens live in src/app/globals.css.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "../shared/**/*.ts"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--c-bg) / <alpha-value>)",
        surface: "rgb(var(--c-surface) / <alpha-value>)",
        card: "rgb(var(--c-card) / <alpha-value>)",
        line: "rgb(var(--c-line) / <alpha-value>)",
        ink: "rgb(var(--c-ink) / <alpha-value>)",
        mute: "rgb(var(--c-mute) / <alpha-value>)",
        brand: "rgb(var(--c-brand) / <alpha-value>)",
        brand2: "rgb(var(--c-brand2) / <alpha-value>)",
        term: "rgb(var(--c-term-bg) / <alpha-value>)",
        "term-ink": "rgb(var(--c-term-ink) / <alpha-value>)",
        "term-accent": "rgb(var(--c-term-accent) / <alpha-value>)",
      },
      borderRadius: {
        lg: "var(--r-sm)",
        xl: "var(--r-md)",
        "2xl": "var(--r-lg)",
        "3xl": "var(--r-xl)",
      },
      fontFamily: {
        sans: ["var(--ff-body)", "system-ui", "sans-serif"],
        display: ["var(--ff-head)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "var(--shadow-glow)",
        "glow-lg": "var(--shadow-glow)",
        card: "var(--shadow-card)",
      },
      keyframes: {
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        glitch: {
          "0%, 100%": { transform: "translate(0, 0)", opacity: "1" },
          "20%": { transform: "translate(-2px, 1px)", opacity: "0.8" },
          "40%": { transform: "translate(2px, -1px)", opacity: "0.92" },
          "60%": { transform: "translate(-1px, 0)", opacity: "0.85" },
          "80%": { transform: "translate(1px, 1px)", opacity: "0.96" },
        },
        bootGlow: {
          "0%, 100%": { opacity: "0.65", filter: "brightness(1)" },
          "50%": { opacity: "1", filter: "brightness(1.3)" },
        },
        morseReveal: {
          "0%": { opacity: "0", transform: "scale(0.4)" },
          "60%": { opacity: "1", transform: "scale(1.15)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        blink: "blink 1.06s step-end infinite",
        float: "float 7s ease-in-out infinite",
        shimmer: "shimmer 2.2s linear infinite",
        "pulse-soft": "pulseSoft 2.4s ease-in-out infinite",
        glitch: "glitch 0.35s steps(2, end) 1",
        "boot-glow": "bootGlow 2.2s ease-in-out infinite",
        "morse-reveal": "morseReveal 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
