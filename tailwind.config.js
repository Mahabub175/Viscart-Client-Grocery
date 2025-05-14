/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primaryColor)",
        primaryLight: "var(--secondaryColor)",
        navyBlue: "#00235B",
        orange: "#F97316",
        danger: "#FB564B",
        textColor: "#4D4D4D",
        grey: "#f1f1f1",
        redLight: "rgba(221, 24, 28, 0.05)",
      },
      boxShadow: {
        xl: "0 0 10px 5px #e5e5e5",
      },
      screens: {
        sm: "580px",
        md: "600px",
        lg: "980px",
        xl: "1280px",
        xxl: "1600px",
      },
    },
  },
  plugins: [],
};
