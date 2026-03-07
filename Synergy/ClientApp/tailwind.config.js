/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            colors: {
                /* semantic tokens (alpha enabled) */
                background: "rgb(var(--synergy-bg-dark-rgb) / <alpha-value>)",
                foreground: "rgb(249 250 251 / <alpha-value>)",

                primary: "rgb(var(--synergy-green-rgb) / <alpha-value>)",
                "primary-foreground": "rgb(255 255 255 / <alpha-value>)",

                /* Synergy palette (alpha enabled) */
                "synergy-bg-dark": "rgb(var(--synergy-bg-dark-rgb) / <alpha-value>)",
                "synergy-black": "rgb(var(--synergy-black-rgb) / <alpha-value>)",
                "synergy-charcoal": "rgb(var(--synergy-charcoal-rgb) / <alpha-value>)",
                "synergy-dark-gray": "rgb(var(--synergy-dark-gray-rgb) / <alpha-value>)",
                "synergy-light-gray": "rgb(var(--synergy-light-gray-rgb) / <alpha-value>)",
            },
            borderRadius: {
                lg: "0.75rem",
                xl: "1rem",
                "2xl": "1rem",
            },
            boxShadow: {
                "glow-sm": "0 0 15px rgb(var(--synergy-green-rgb) / 0.30)",
                "glow-md": "0 0 25px rgb(var(--synergy-green-rgb) / 0.30)",
                "glow-lg": "0 0 40px rgb(var(--synergy-green-rgb) / 0.40)",
            },
        },
    },
    plugins: [],
};