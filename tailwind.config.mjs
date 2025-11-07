import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
  ],
  safelist: [
    {
      pattern: /(yellow-mode|red-mode):.*/,
    },
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist", ...defaultTheme.fontFamily.sans],
        serif: ["Geist", ...defaultTheme.fontFamily.serif],
        display: ["Ugly Dave", ...defaultTheme.fontFamily.sans],
        vcr: ["VCR OSD Mono", ...defaultTheme.fontFamily.mono],
      },
      colors: {
        'custom-red': '#e5302d',
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
