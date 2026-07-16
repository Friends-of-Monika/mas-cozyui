import { cloudflare } from "@cloudflare/vite-plugin";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [svelte(), tailwindcss(), cloudflare()],
	resolve: {
		alias: {
			// Repo-root theme sources (templates + definitions), which live
			// outside the editor package. import.meta.glob honors this alias.
			$theme: fileURLToPath(new URL("../mod/theme", import.meta.url)),
			$themes: fileURLToPath(new URL("../themes", import.meta.url))
		}
	},
	server: {
		fs: {
			// Theme sources are imported from the repo root
			allow: [".."]
		}
	}
});
