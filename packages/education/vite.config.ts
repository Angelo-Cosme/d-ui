import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.test.tsx',
        'src/**/*.stories.tsx',
        'src/**/*.mdx',
        'src/test/**',
      ],
      entryRoot: 'src',
    }),
  ],
  build: {
    lib: {
      entry: { index: resolve(rootDir, 'src/index.ts') },
      formats: ['es'],
      fileName: () => 'index.js',
      cssFileName: 'd-ui-education',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'd-ui'],
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
