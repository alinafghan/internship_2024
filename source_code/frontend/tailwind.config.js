/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  prefix: "",
  theme: {
    fontFamily: {
      nunito: ["Nunito", "sans-serif"],
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      scrollbar: {
        none: {
          display: "none",
        },
      },
      overscrollBehavior: {
        none: "none",
      },
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(0.25turn, #FFCE01 100vh, whitesmoke)",
      },
      backgroundSize: {
        "300-100": "300% 100%",
      },
      transitionProperty: {
        "background-position": "background-position",
      },
      colors: {
        text: "var(--text)",
        background: "var(--background)",
        primary: "var(--primary)",
        destructive: "var(--destructive)",
        secondary: "var(--secondary)",
        tertiary: "var(--tertiary)",
        extra: "var(--extra)",
        accent: "var(--accent)",
        border: "var(--secondary)",
        input: "var(--secondary)",
        ring: "var(--accent)",
        foreground: "var(--text)",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        xlg: "calc(var(--radius) + 20px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xsm: "calc(var(--radius) - 20px)",
      },
      fontSize: {
        xlg: "2rem",
        lg: "1rem", // 18px
        md: "1rem", // 16px
        sm: "0.875rem", // 14px
        xsm: "0.65rem",
        xxsm: "0.45rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  variants: {
    extend: {
      width: ["hover"],
    },
  },
  plugins: [require("tailwindcss-animate")],
  plugins: [require("@tailwindcss/typography")],
  plugins: [require("tailwind-scrollbar-hide")],
};
