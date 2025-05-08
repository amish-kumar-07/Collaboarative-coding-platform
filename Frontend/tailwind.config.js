/** @type {import('tailwindcss').Config} */
export default {
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['system-ui', 'sans-serif'],
        },
        colors: {
          // You can add custom colors here if needed
        },
      },
    },
    plugins: [
      // You can add tailwind plugins here if needed
    ],
  }