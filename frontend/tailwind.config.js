export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        stripe: {
          purple: "#635bff",
          purpleDark: "#4c43e6",
          dark: "#0a2540",
          gray: "#adbdcc",
          lightGray: "#e6ebf1",
          bg: "#f6f9fc",
          teal: "#00d4b2",
        }
      }
    },
  },
  plugins: [],
};