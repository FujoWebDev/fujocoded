/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    fontFamily: {
      hatch: ['"Hatch"', "serif"],
      zeitung: ['"Zeitung Mono Pro"', "sans-serif"],
      macho: ['"Macho"', "sans-serif"],
      hydrophilia: ["hydrophilia-iced", "sans-serif"],
      // Add more custom font families as needed
    },
    extend: {
      typography: {
        lg: {
          css: [
            {
              color: "inherit",
              "h1, h2": {
                color: "#FF38EB",
              },
              "h3, h4, h5, h6": {
                color: "inherit",
              },
              strong: {
                color: "inherit",
              },
            },
          ],
        },
      },
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
      dropShadow: {
        purple: "0px 1px 1.5px #5514e0e5",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
