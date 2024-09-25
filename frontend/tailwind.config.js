/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js}"],
    theme: {
        extend: {
            padding: {
                safeb: "env(safe-area-inset-bottom)",
                safet: "env(safe-area-inset-top)",
            },
            boxShadow: {
                top: "0 -4px 10px rgba(0, 0, 0, 0.3)",
                right: "4px 0 10px rgba(0, 0, 0, 0.3)",
                bottom: "0 4px 10px rgba(0, 0, 0, 0.3)",
                left: "-4px 0 10px rgba(0, 0, 0, 0.3)",
            },
            colors: {
                "dark-blue-1": "#0a0f29", // Darkest blue
                "dark-blue-2": "#102a44", // Dark blue for the gradient
                "light-blue": "#3a86ff", // Lighter blue for the diagonal line
            },
        },
    },
    plugins: [],
};
