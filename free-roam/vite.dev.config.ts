import replace from "@rollup/plugin-replace";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
	publicDir: "public",
	build: {
		lib: {
			entry: resolve(__dirname, "index.ts"),
			name: "freeroam-arcadia-23",
			fileName: "freeroam-arcadia-23",
		},
		rollupOptions: {
			external: ["phaser", "lit", "react", "buffer"],
			output: {
				globals: {
					phaser: "Phaser",
					lit: "lit",
					buffer: "Buffer",
				},
			},
			plugins: [
				// Enable/Disable Phaser Features
				replace({
					"typeof CANVAS_RENDERER": "'true'",
					"typeof WEBGL_RENDERER": "'true'",
					"typeof EXPERIMENTAL": "'false'",
					"typeof PLUGIN_CAMERA3D": "'false'",
					"typeof PLUGIN_FBINSTANT": "'false'",
					"typeof FEATURE_SOUND": "'false'",
				}),
			],
		},
	},
});
