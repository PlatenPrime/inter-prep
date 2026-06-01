import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['examples/react/_shared/setup.ts'],
    include: ['examples/react/**/*.test.tsx'],
    globals: true,
    pool: 'forks',
  },
});
