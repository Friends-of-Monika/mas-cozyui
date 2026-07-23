import { zipSync } from "fflate";
import { mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { extname, join, relative, sep } from "node:path";

import { groupForPath } from "../colors";
import { type MacroParams, applyMacros } from "../macros";
import { inlineExternalSvgs } from "../svg";

import { fontDataUrl, fontFamilyName, resolveFontPath } from "./font";
import { type ThemeDefinition, definitionToMacroParams } from "./params";
import { Rasterizer } from "./render";

export interface BuildOptions {
	/** themes/*.json definitions. */
	themesDir: string;
	/** mod/theme template tree (SVG/RPY/JSON/assets). */
	templateDir: string;
	/** Shipped fonts, for @font-face embedding + family-name lookup. */
	fontsDir: string;
	/** Where the {id}.zip archives are written. */
	outDir: string;
	/** Render scales to build; 1 = base, 2 = HiDPI. Defaults to [1, 2]. */
	scales?: number[];
	log?: (message: string) => void;
}

const toPosix = (p: string) => p.split(sep).join("/");

function walk(dir: string): string[] {
	const out: string[] = [];
	for (const name of readdirSync(dir)) {
		const abs = join(dir, name);
		if (statSync(abs).isDirectory()) out.push(...walk(abs));
		else out.push(abs);
	}
	return out;
}

// A data: SVG can't use the page's installed fonts, so text-bearing templates
// need the main font embedded as a base64 @font-face (mirrors the editor export;
// only the main font is embedded, matching its behaviour exactly).
function embedFont(svg: string, params: MacroParams, fontsDir: string): string {
	if (!svg.includes("<text")) return svg;
	const path = resolveFontPath(fontsDir, params.mainFontRegular ?? "");
	if (!path) return svg;
	const url = fontDataUrl(path);
	const face = `<defs><style>@font-face{font-family:'${params.mainFontName}';src:url('${url}') format('truetype');}</style></defs>`;
	return svg.replace(/(<svg[^>]*>)/, `$1${face}`);
}

/**
 * Builds every themes/*.json into an installable theme archive (mod/theme with
 * each SVG rasterized to PNG and the CUI_* macros baked in), at each scale. The
 * Node counterpart of the editor's exportTheme; replaces the old Inkscape/Pillow
 * Python builder. Output matches what build-package.sh expects in build/themes/.
 */
export async function buildAllThemes(options: BuildOptions): Promise<void> {
	const { themesDir, templateDir, fontsDir, outDir, scales = [1, 2] } = options;
	const log = options.log ?? ((m: string) => console.log(`BUILD: ${m}`));
	const encoder = new TextEncoder();

	rmSync(outDir, { recursive: true, force: true });
	mkdirSync(outDir, { recursive: true });

	// Load the template tree once; it's identical across themes and scales.
	const entries = walk(templateDir).map((abs) => ({
		abs,
		rel: toPosix(relative(templateDir, abs)),
		ext: extname(abs)
	}));
	const svgTemplates: Record<string, string> = {};
	for (const { abs, rel, ext } of entries) if (ext === ".svg") svgTemplates[rel] = readFileSync(abs, "utf8");

	const themeFiles = readdirSync(themesDir)
		.filter((f) => f.endsWith(".json"))
		.sort();

	const raster = await Rasterizer.launch();
	try {
		for (const themeFile of themeFiles) {
			const def = JSON.parse(readFileSync(join(themesDir, themeFile), "utf8")) as ThemeDefinition;
			const mainPath = resolveFontPath(fontsDir, def.main_font.regular);
			const mainFontName = mainPath ? fontFamilyName(mainPath) : "Nunito";

			for (const scale of scales) {
				// HiDPI carries an _hidpi id + "(HiDPI)" name so the submod pairs it
				// with its base theme (theme_manager use_hidpi).
				const id = scale === 1 ? def.id : `${def.id}_hidpi`;
				const name = scale === 1 ? def.name : `${def.name} (HiDPI)`;
				const params = definitionToMacroParams(def, { scale, themeId: id, themeName: name, mainFontName });

				const files: Record<string, Uint8Array> = {};
				for (const { abs, rel, ext } of entries) {
					if (ext === ".glitch") continue; // consumed as a sibling, never shipped

					if (ext === ".svg") {
						const group = groupForPath(rel);
						const macroed = inlineExternalSvgs(
							applyMacros(svgTemplates[rel], params, group),
							svgTemplates,
							params
						);
						const svg = embedFont(macroed, params, fontsDir);
						const glitchEntry = entries.find((e) => e.rel === rel.replace(/\.svg$/, ".glitch"));
						const glitch = glitchEntry ? readFileSync(glitchEntry.abs, "utf8") : null;
						// preview.png stays at base size even in a HiDPI build.
						const outScale = rel.endsWith("preview.svg") ? 1 : scale;
						files[rel.replace(/\.svg$/, ".png")] = await raster.rasterize(svg, scale, glitch, outScale);
					} else if (ext === ".rpy" || ext === ".json") {
						files[rel] = encoder.encode(applyMacros(readFileSync(abs, "utf8"), params, groupForPath(rel)));
					} else {
						files[rel] = new Uint8Array(readFileSync(abs));
					}
				}

				writeFileSync(join(outDir, `${id}.zip`), zipSync(files, { level: 9 }));
				log(`Created archive for ${id}`);
			}
		}
	} finally {
		await raster.close();
	}

	log("Finished!");
}
