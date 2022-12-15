import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: 'oura-node-editor',
      fileName: 'oura-node-editor',
    },
  },
  plugins: [react(), dts()],
})
