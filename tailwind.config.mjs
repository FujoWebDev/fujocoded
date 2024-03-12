/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    fontFamily: {
      hatch: ['"Hatch"', "sans-serif"],
      zeitung: ['"Zeitung Mono Pro"', "sans-serif"],
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
      },
    },
  },
  plugins: [],
};
