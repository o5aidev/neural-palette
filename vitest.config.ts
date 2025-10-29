import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    testTimeout: 30000, // 30 seconds for individual tests
    hookTimeout: 30000, // 30 seconds for beforeEach/afterEach hooks
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/e2e/**', // Exclude E2E tests (run with Playwright)
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'e2e/',
        '**/*.config.ts',
        '**/*.d.ts',
        '**/index.ts', // Demo files
      ],
    },
  },
});
