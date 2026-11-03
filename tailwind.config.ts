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
        fond: "var(--c-bg)",
        panneau: "var(--c-panel)",
        bordure: "var(--c-panel-bord)",
        accent: "var(--c-accent)",
        encre: "var(--c-texte)",
        "encre-douce": "var(--c-texte-doux)",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        ui: ["var(--font-ui)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
