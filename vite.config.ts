import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: 'oura-node-editor',
      fileName: 'oura-node-editor',
    },
  },
  plugins: [react()],
})
