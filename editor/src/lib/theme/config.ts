import { unzipSync, zipSync } from "fflate";

import type { ColorModulation } from "#lib/preview/colors";
import { addFontBytes, customFonts } from "#lib/preview/fonts.svelte";
import {
	type MainFont,
	type MenuFont,
	type OptionFont,
	type PatternShape,
	mainFonts,
	menuFonts,
	optionFonts,
	theme
} from "#lib/preview/theme.svelte";

import { DEFAULT_METRICS } from "./params.svelte";
import { themeParams } from "./params.svelte";

/** Theme definition JSON, identical in shape to the files in themes/. */
export interface ThemeConfig {
	name: string;
	id: string;
	button_rounding: number;
	frame_rounding: number;
	dialogue_rounding: number;
	menu_pattern_shape: string;
	dialogue_pattern_shape: string;
	main_font: { regular: string; italic: string; bold: string; bold_italic: string };
	menu_font: string;
	option_font: string;
	main_font_kerning: number;
	dialogue_vertical_offset: number;
	dialogue_line_spacing: number;
	button_height_adjustment: number;
	button_text_vertical_offset: number;
	primary_color: ColorModulation;
	secondary_color: ColorModulation;
}

function slug(name: string): string {
	return name.trim().toLowerCase().replace(/\s+/g, "_") || "custom";
}

// Resolves a font path back to a family name: a custom font (matched by its
// fonts/ filename) takes precedence, otherwise a built-in family substring.
function resolveFamily<T extends string>(path: string, families: readonly T[], fallback: T): string {
	const custom = customFonts.find((f) => path.endsWith(`fonts/${f.file}`) || path.endsWith(f.file));
	if (custom) return custom.family;
	return families.find((family) => path.includes(family)) ?? fallback;
}

/** Serializes the live theme to the themes/ JSON shape. */
export function toConfig(): ThemeConfig {
	const p = themeParams();
	return {
		name: theme.name,
		id: slug(theme.name),
		button_rounding: theme.buttonRounding,
		frame_rounding: theme.frameRounding,
		dialogue_rounding: theme.dialogueRounding,
		menu_pattern_shape: theme.menuPatternShape,
		dialogue_pattern_shape: theme.dialoguePatternShape,
		main_font: {
			regular: p.mainFontRegular ?? "",
			italic: p.mainFontItalic ?? "",
			bold: p.mainFontBold ?? "",
			bold_italic: p.mainFontBoldItalic ?? ""
		},
		menu_font: p.menuFont ?? "",
		option_font: p.optionFont ?? "",
		main_font_kerning: DEFAULT_METRICS.mainFontKerning,
		dialogue_vertical_offset: DEFAULT_METRICS.dialogueVerticalOffset,
		dialogue_line_spacing: DEFAULT_METRICS.dialogueLineSpacing,
		button_height_adjustment: DEFAULT_METRICS.buttonHeightAdjustment,
		button_text_vertical_offset: DEFAULT_METRICS.buttonTextVerticalOffset,
		primary_color: { ...theme.primary },
		secondary_color: { ...theme.secondary }
	};
}

/** Applies a theme config to the live theme state. */
export function applyConfig(config: ThemeConfig) {
	theme.name = config.name ?? "Custom";
	theme.buttonRounding = config.button_rounding;
	theme.frameRounding = config.frame_rounding;
	theme.dialogueRounding = config.dialogue_rounding;
	theme.menuPatternShape = config.menu_pattern_shape as PatternShape;
	theme.dialoguePatternShape = config.dialogue_pattern_shape as PatternShape;
	theme.mainFont = resolveFamily<MainFont>(config.main_font.regular, mainFonts, "Nunito");
	theme.menuFont = resolveFamily<MenuFont>(config.menu_font, menuFonts, "Riffic");
	theme.optionFont = resolveFamily<OptionFont>(config.option_font, optionFonts, "Halogen");
	Object.assign(theme.primary, config.primary_color);
	Object.assign(theme.secondary, config.secondary_color);
}

/**
 * Packs the live theme into a .cozy project: a max-compressed zip holding the
 * theme config and a fonts/ folder carrying any user-added custom fonts.
 */
export function packCozy(): Blob {
	const config = toConfig();
	const files: Record<string, Uint8Array> = {
		"config.json": new TextEncoder().encode(JSON.stringify(config, null, 2)),
		"fonts/": new Uint8Array(0)
	};
	for (const font of customFonts) files[`fonts/${font.file}`] = font.bytes;
	return new Blob([zipSync(files, { level: 9 })], { type: "application/zip" });
}

/** Reads a .cozy project file and applies its config to the live theme. */
export async function openCozy(file: File) {
	const buf = new Uint8Array(await file.arrayBuffer());
	const files = unzipSync(buf);
	const configBytes = files["config.json"];
	if (!configBytes) throw new Error("Not a valid .cozy project (missing config.json)");

	// Register the project's fonts first so the config's font paths resolve to
	// their families (skip any already loaded with the same filename).
	for (const [name, bytes] of Object.entries(files)) {
		if (!name.startsWith("fonts/") || name.endsWith("/") || bytes.length === 0) continue;
		const fileName = name.slice("fonts/".length);
		if (customFonts.some((f) => f.file === fileName)) continue;
		await addFontBytes(fileName, bytes);
	}

	applyConfig(JSON.parse(new TextDecoder().decode(configBytes)) as ThemeConfig);
}
