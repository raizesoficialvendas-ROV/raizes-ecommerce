import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- Paleta Raízes: Luxo Minimalista ---
        // Neutros principais
        obsidian: {
          DEFAULT: "#0A0A0A",
          50: "#1A1A1A",
          100: "#141414",
        },
        ivory: {
          DEFAULT: "#F8F5F0",
          50: "#FDFCFA",
          100: "#F5F1EB",
          200: "#EDE8E0",
        },
        // Cinzas sóbrios
        stone: {
          50: "#F9F8F7",
          100: "#F0EDEA",
          200: "#E0DBD5",
          300: "#C8C0B8",
          400: "#A89E94",
          500: "#887C72",
          600: "#6B5F55",
          700: "#504540",
          800: "#352E2A",
          900: "#1C1714",
        },
        // Bege luxuoso (inspirado em linho/seda)
        linen: {
          DEFAULT: "#E8DFD0",
          50: "#F5F0E8",
          100: "#EDE5D8",
          200: "#DFD4C2",
          300: "#C9BAA5",
        },
        // Dourado discreto (detalhes premium)
        gold: {
          DEFAULT: "#C8A96E",
          light: "#D4BA88",
          dark: "#A88A50",
          muted: "#E8D5A8",
        },
        // Aliases semânticos
        background: "#F8F5F0",
        foreground: "#0A0A0A",
        muted: "#887C72",
        border: "#E0DBD5",
        card: "#FFFFFF",
      },
      fontFamily: {
        // Serifada elegante — para títulos e headlines
        serif: ["var(--font-playfair)", "Georgia", "Times New Roman", "serif"],
        // Sans-serif premium — para corpo de texto
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        // Alternativa editorial
        display: ["var(--font-cormorant)", "Georgia", "serif"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
        xs: ["0.75rem", { lineHeight: "1.125rem", letterSpacing: "0.08em" }],
        sm: ["0.875rem", { lineHeight: "1.375rem", letterSpacing: "0.02em" }],
        base: ["1rem", { lineHeight: "1.6rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.875rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem", letterSpacing: "-0.01em" }],
        "3xl": ["1.875rem", { lineHeight: "2.375rem", letterSpacing: "-0.02em" }],
        "4xl": ["2.25rem", { lineHeight: "2.75rem", letterSpacing: "-0.02em" }],
        "5xl": ["3rem", { lineHeight: "3.5rem", letterSpacing: "-0.03em" }],
        "6xl": ["3.75rem", { lineHeight: "4.25rem", letterSpacing: "-0.04em" }],
        "7xl": ["4.5rem", { lineHeight: "5rem", letterSpacing: "-0.04em" }],
        "8xl": ["6rem", { lineHeight: "6.5rem", letterSpacing: "-0.05em" }],
        "9xl": ["8rem", { lineHeight: "8.5rem", letterSpacing: "-0.05em" }],
      },
      letterSpacing: {
        tightest: "-0.05em",
        tighter: "-0.03em",
        tight: "-0.01em",
        normal: "0",
        wide: "0.05em",
        wider: "0.1em",
        widest: "0.2em",
        "ultra-wide": "0.3em",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
        "34": "8.5rem",
        "38": "9.5rem",
        "42": "10.5rem",
        "46": "11.5rem",
        "50": "12.5rem",
        "54": "13.5rem",
        "58": "14.5rem",
        "62": "15.5rem",
        "66": "16.5rem",
        "70": "17.5rem",
        "74": "18.5rem",
        "78": "19.5rem",
        "82": "20.5rem",
        "86": "21.5rem",
        "90": "22.5rem",
        "120": "30rem",
        "160": "40rem",
      },
      borderRadius: {
        none: "0",
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
        full: "9999px",
      },
      boxShadow: {
        "luxury-sm": "0 1px 3px rgba(10,10,10,0.06), 0 1px 2px rgba(10,10,10,0.04)",
        luxury: "0 4px 16px rgba(10,10,10,0.06), 0 2px 6px rgba(10,10,10,0.04)",
        "luxury-md": "0 8px 32px rgba(10,10,10,0.08), 0 4px 12px rgba(10,10,10,0.05)",
        "luxury-lg": "0 16px 48px rgba(10,10,10,0.10), 0 8px 20px rgba(10,10,10,0.06)",
        "luxury-xl": "0 24px 64px rgba(10,10,10,0.12), 0 12px 28px rgba(10,10,10,0.08)",
        "inner-luxury": "inset 0 1px 3px rgba(10,10,10,0.08)",
        none: "none",
      },
      transitionDuration: {
        "250": "250ms",
        "350": "350ms",
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
        "1200": "1200ms",
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.25, 0.1, 0.25, 1)",
        "luxury-in": "cubic-bezier(0.4, 0, 1, 1)",
        "luxury-out": "cubic-bezier(0, 0, 0.2, 1)",
        "luxury-in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) forwards",
        "fade-up": "fadeUp 0.7s cubic-bezier(0.25, 0.1, 0.25, 1) forwards",
        "slide-in-right": "slideInRight 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards",
        "slide-in-left": "slideInLeft 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards",
        "scale-in": "scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          from: { opacity: "0", transform: "translateX(24px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        slideInLeft: {
          from: { opacity: "0", transform: "translateX(-24px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      screens: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
        "3xl": "1600px",
      },
    },
  },
  plugins: [],
};

export default config;
