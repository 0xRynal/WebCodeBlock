import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Configuration pour le mode développement (page de test)
  if (mode === 'development') {
    return {
      plugins: [react()],
      root: 'example',
      publicDir: '../public',
      server: {
        port: 3001,
        open: true,
      },
    };
  }

  // Configuration pour le build du package
  return {
    plugins: [
      react(),
      dts({
        insertTypesEntry: true,
        include: ['src/**/*'],
        outDir: 'dist',
        entryRoot: 'src',
      }),
    ],
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'WebCodeBlock',
        formats: ['es', 'cjs'],
        fileName: (format) => `web-code-block.${format === 'es' ? 'es' : 'cjs'}.js`,
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'react/jsx-runtime'],
        output: {
          exports: 'named',
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        },
      },
      sourcemap: true,
      emptyOutDir: true,
      outDir: 'dist',
    },
  };
});

