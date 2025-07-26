/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {}
    },
    plugins: [require("daisyui")],
    corePlugins: {
        preflight: false
    },
    daisyui: {
        base: false,
        themes: [
            "light",
            "dark",
            "nord",
        ]
    }
};
