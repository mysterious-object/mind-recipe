import { defineConfig } from 'vite'

// The web preview serves the exact self-contained interface packaged on mobile.
export default defineConfig({ root: 'flutter/assets/clarity', build: { outDir: '../../../dist', emptyOutDir: true } })
