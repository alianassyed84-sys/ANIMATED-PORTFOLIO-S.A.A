import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A192F",
        secondary: "#000000",
        primaryText: "#FFFFFF",
        secondaryText: "#8892B0",
        accentSilver: "#CCD6F6",
        accentCyan: "#64FFDA",
        accentBlue: "#3b82f6",
        tag: {
          ecommerce: "#4ade80",
          education: "#3b82f6",
          ai: "#b794f6",
          fullstack: "#00d9ff",
          backend: "#ef4444",
          creative: "#a855f7",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        mono: ["var(--font-jetbrains-mono)"],
      },
      backgroundImage: {
        'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))',
      },
    },
  },
  plugins: [],
};
export default config;
