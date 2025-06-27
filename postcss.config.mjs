/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    'postcss-nested': {}, // Must be after tailwindcss
    autoprefixer: {}, // Optional but recommended
  },
};

export default config;