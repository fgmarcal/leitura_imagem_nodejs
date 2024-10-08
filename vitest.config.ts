import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        coverage: {
        provider: 'v8',
        reporter: ['text', 'json'],
        reportsDirectory: './src/__tests__/unit/coverage'
        },
    },
})