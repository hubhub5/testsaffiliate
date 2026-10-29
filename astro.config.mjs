import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://hubhub5.github.io',
  base: '/testsaffiliate/',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
