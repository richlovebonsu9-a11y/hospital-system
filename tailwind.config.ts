import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        medical: {
          red: "#E53E3E",
          "red-dark": "#C53030",
          "red-light": "#FED7D7",
          blue: "#2B6CB0",
          "blue-dark": "#2C5282",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
