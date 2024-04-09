/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    fontFamily: {
      hatch: ['"Hatch"', "serif"],
      zeitung: ['"Zeitung Mono Pro"', "sans-serif"],
      macho: ['"Macho"', "sans-serif"],
      // Add more custom font families as needed
    },
    extend: {
      colors: {
        "lemon-dark": "#ffbf00",
        "lemon-dark-transparent": "#ffbf0080",
        lemon: "#f6d880",
        "teal-dark": "#5a99dc",
        teal: "#5be2ef",
        "teal-light": "#c8f4f4",
        "fujo-blue": "#4360F7",
        "fujo-pink": "#FF38EB",
        "fujo-purple": "#4D2E91",
        "fujo-green": "#A7FF90",
        "kickstarter-green": "#05ce78",
        "nyancat-blue": "#013466",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
