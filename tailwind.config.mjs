/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    colors: {
      "lemon-dark": "#ffbf00",
      "lemon-dark-transparent": "#ffbf0080",
      lemon: "#f6d880",
    },
    fontFamily: {
      hatch: ['"Hatch"', "sans-serif"],
      // Add more custom font families as needed
    },
    extend: {},
  },
  plugins: [],
};
