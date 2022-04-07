/* eslint-env node */

import { node } from '../../.electron-vendors.cache.json';
import { join } from 'path';
import { builtinModules } from 'module';
import reactVite from '@vitejs/plugin-react';
import electronRenderer from 'vite-plugin-electron/renderer';

const PACKAGE_ROOT = __dirname;

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  resolve: {
    alias: {
      '/@/': join(PACKAGE_ROOT, 'src') + '/',
    },
  },
  plugins: [reactVite(), electronRenderer()],
  base: '',
  server: {
    fs: {
      strict: true,
    },
  },
  build: {
    sourcemap: true,
    target: `node${node}`,
    outDir: 'dist',
    assetsDir: '.',
    rollupOptions: {
      input: {
        main: join(PACKAGE_ROOT, 'index.html'),
      },
      external: [...builtinModules.flatMap((p) => [p, `node:${p}`])],
    },
    emptyOutDir: true,
    brotliSize: false,
  },
  test: {
    environment: 'happy-dom',
  },
};

export default config;
