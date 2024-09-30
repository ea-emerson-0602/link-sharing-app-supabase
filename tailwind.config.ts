import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryPurple: "#A855F7",
        primaryActive: "#BEADFF",
        error: "#FF3939",
        primaryText: "#333333",
        primaryDisabled: "#D9D9D9",
        secondaryText: "#737373",
        primaryBg: "#FAFAFA",
        secondaryBg: "#EFEBFF",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
