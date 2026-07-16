// @ts-check
import { defineConfig } from 'astro/config';
import { SITE } from './src/site.config.ts';

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
});