import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['../js/**/*.js'],
      exclude: ['node_modules', 'dist']
    },
    testTimeout: 10000
  }
});
