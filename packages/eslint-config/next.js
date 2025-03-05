module.exports = {
  extends: [
    'next/core-web-vitals'
  ],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  env: {
    browser: true,
    node: true,
  },
  rules: {
    // Place any Next.js-specific overrides here
  },
};
