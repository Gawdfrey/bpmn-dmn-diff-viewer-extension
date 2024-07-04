import { resolve } from "node:path";
import {
	makeEntryPointPlugin,
	watchRebuildPlugin,
} from "@bpmn-dmn-diff-viewer-extension/hmr";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

const rootDir = resolve(__dirname);
const srcDir = resolve(rootDir, "src");

const isDev = process.env.__DEV__ === "true";
const isProduction = !isDev;

function build() {
	console.log("Building content-ui");
}

export default defineConfig({
	resolve: {
		alias: {
			"@src": srcDir,
		},
	},
	base: "",
	plugins: [
		react(),
		isDev && watchRebuildPlugin({ refresh: true, onStart: build }),
		isDev && makeEntryPointPlugin(),
	],
	publicDir: resolve(rootDir, "public"),
	build: {
		lib: {
			entry: resolve(srcDir, "index.tsx"),
			name: "contentUI",
			formats: ["iife"],
			fileName: "index",
		},
		outDir: resolve(rootDir, "..", "..", "dist", "content-ui"),
		sourcemap: isDev,
		minify: isProduction ? "terser" : false,
		reportCompressedSize: isProduction,
		rollupOptions: {
			external: ["chrome"],
		},
		terserOptions: {
			format: {
				ascii_only: true,
			},
		},
	},
	define: {
		"process.env.NODE_ENV": isDev ? `"development"` : `"production"`,
	},
});
