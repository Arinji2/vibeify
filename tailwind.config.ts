import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      height: {
        excludeNav: "calc(100svh - 130px)",
        excludeMobNav: "calc(100svh - 80px)",
        cScreen: "100svh",
      },
      minHeight: {
        excludeNav: "calc(100svh - 130px)",
        excludeMobNav: "calc(100svh - 80px)",
      },
      boxShadow: {
        button: "4px 4px 0px 0px #000",
        buttonHover: "2px 2px 0px 0px #000",
      },
      colors: {
        palette: {
          text: "#000000",
          background: "#E1EFDC",
          primary: "#77C089",
          secondary: "#558761",
          tertiary: "#C0E2DA",
          accent: "#43937F",
          success: "#3BBD58",
          error: "#BD3B3B",
          info: "#252625",
          offWhite: "#D9D9D9",
        },
      },
    },
  },
  plugins: [],
};
export default config;
