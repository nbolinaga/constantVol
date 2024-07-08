/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/app/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        darkness: 'var(--color-darkness)',
        smoke: 'var(--color-smoke)',
        carmesi: 'var(--color-carmesi)',
        white: 'var(--color-white)',
        greySmoke: 'var(--color-greySmoke)',
      },
    },
  },
  plugins: [],
}
