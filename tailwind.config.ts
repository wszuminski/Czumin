import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        fadeOut: { "0%": { opacity: "1" }, "100%": { opacity: "0" } },
      },
      animation: {
        "fade-in": "fadeIn 300ms ease-out",
        "fade-out": "fadeOut 300ms ease-in forwards",
      },
    },
  },
  plugins: [],
} satisfies Config;
