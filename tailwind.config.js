/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#6495ED',
                    50: '#F0F4FE',
                    100: '#E1EAFD',
                    200: '#C3D5FB',
                    300: '#A5C0F9',
                    400: '#87ABF7',
                    500: '#6495ED',
                    600: '#3D73E5',
                    700: '#2456C8',
                    800: '#1C4299',
                    900: '#142E6A',
                },
                surface: '#FFFFFF',
                background: '#F8F9FA',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
            },
        },
    },
    plugins: [],
}
