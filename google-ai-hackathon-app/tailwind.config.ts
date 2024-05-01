import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "green": {
          "standard": "#ABDEC9",
          "pale": "#F2FCF8",
          "disabled": "#BBC9C4",
          "text": "#3FA279",
          "dark": "#2B4038"
        },
        "grey": {
          "pale": "#ADADAD"
        },
        "red": {
          "error": "#800800",
          "error-medium": "#EB5A50"
        },
        "yellow":{
          "warning": "#A37E02",
          "warning-pale": "#FFF1C4"
        }
      },
      fontFamily: {
        zenKakuGothicAntique: ['var(--font-zen-kaku-gothic-antique)'],
      },
      minHeight: {
        "min-content-height": "calc(100vh - (123 + 64))"
      }
    },
  },
  plugins: [],
};
export default config;
