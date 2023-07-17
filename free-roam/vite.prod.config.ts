import { resolve } from "path";
import replace from "@rollup/plugin-replace";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
	plugins: [dts()],
	server: {
		open: "/test/demo.html",
	},
	build: {
		lib: {
			formats: ["es"],
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
					react: "React",
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
		sourcemap: true,
	},
});
