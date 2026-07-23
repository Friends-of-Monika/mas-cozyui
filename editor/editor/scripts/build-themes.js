// Builds the CozyUI theme archives (build/themes/*.zip) that build-package.sh
// ships under game/Submods/CozyUI/themes/. Thin CLI over @cozyui/theme-builder;
// replaces the old scripts/build-themes.py (Inkscape + Pillow). Run with:
//
//   yarn build:themes           (from the editor/ workspace root or the app)
//
// Requires the workspace deps installed (puppeteer's Chromium in particular).
import { buildAllThemes } from "@cozyui/theme-builder/node";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// editor/editor/scripts/build-themes.js -> repo root is three levels up.
const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");

await buildAllThemes({
	themesDir: join(root, "themes"),
	templateDir: join(root, "mod", "theme"),
	fontsDir: join(root, "fonts"),
	outDir: join(root, "build", "themes")
});
