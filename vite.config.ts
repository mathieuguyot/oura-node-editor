import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import eslint from "vite-plugin-eslint";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        lib: {
            entry: "src/index.ts",
            name: "oura-node-editor",
            fileName: "oura-node-editor"
        },
        rollupOptions: {
            external: ["react", "react-dom"],
            output: {
                globals: {
                    react: "React",
                    "react-dom": "ReactDOM"
                }
            }
        }
    },
    plugins: [react(), dts(), eslint(), cssInjectedByJsPlugin()]
});
