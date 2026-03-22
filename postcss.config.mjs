const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
  theme: {
    extend: {
      fontFamily: {
        // Map the CSS variables defined in layout.tsx
        podkova: ['var(--font-podkova)', 'sans-serif'],
        funnel : ['var(--font-funnel', 'sans-serif']
      },
    },
  }
};

export default config;
