// @ts-check
import { defineConfig } from 'astro/config';
import { SITE } from './src/site.config.ts';

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  vite: {
    server: {
      watch: {
        // WSL2 + a Windows-mounted drive (/mnt/c/...) doesn't reliably
        // forward file-change events to Linux inotify, so HMR silently
        // misses edits without polling.
        usePolling: true,
        interval: 300,
      },
    },
  },
});