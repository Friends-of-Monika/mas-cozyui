import { unzipSync, zipSync } from "fflate";

import type { ColorModulation } from "#lib/preview/colors";
import { addFontBytes, customFonts } from "#lib/preview/fonts.svelte";
import {
	type Font,
	NO_MODULATION,
	type PatternShape,
	fonts,
	theme
} from "#lib/preview/theme.svelte";

import { CONFIG_VERSION, type RawConfig, migrateConfig } from "./migrate";
import { DEFAULT_METRICS } from "./params.svelte";
import { themeParams } from "./params.svelte";

/**
 * Theme definition JSON, identical in shape to the files in themes/ apart from
 * the editor-only fields at the bottom.
 */
export interface ThemeConfig {
	/** .cozy format version; absent in files written before versioning (v1). */
	version: number;
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
	/** Music-list font; absent in pre-v4 projects (defaults to mplus). */
	music_font: string;
	main_font_kerning: number;
	dialogue_vertical_offset: number;
	dialogue_line_spacing: number;
	button_height_adjustment: number;
	button_text_vertical_offset: number;
	primary_color: ColorModulation;
	secondary_color: ColorModulation;
	/** Surface + text colors; all-null means "follow primary_color". */
	button_color: ColorModulation;
	dialogue_color: ColorModulation;
	button_text_color: ColorModulation;
	dialogue_text_color: ColorModulation;
	// Editor-only extra (the shipped themes/ presets omit it and the submod
	// ignores it - by export time every color is already baked into the PNGs).
	color_overrides?: Record<string, string>;
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
		version: CONFIG_VERSION,
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
		music_font: p.musicFont ?? "",
		main_font_kerning: DEFAULT_METRICS.mainFontKerning,
		dialogue_vertical_offset: DEFAULT_METRICS.dialogueVerticalOffset,
		dialogue_line_spacing: DEFAULT_METRICS.dialogueLineSpacing,
		button_height_adjustment: DEFAULT_METRICS.buttonHeightAdjustment,
		button_text_vertical_offset: DEFAULT_METRICS.buttonTextVerticalOffset,
		primary_color: { ...theme.primary },
		secondary_color: { ...theme.secondary },
		button_color: { ...theme.buttonColor },
		dialogue_color: { ...theme.dialogueColor },
		button_text_color: { ...theme.buttonTextColor },
		dialogue_text_color: { ...theme.dialogueTextColor },
		color_overrides: { ...theme.overrides }
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
	theme.mainFont = resolveFamily<Font>(config.main_font.regular, fonts, "Nunito");
	theme.menuFont = resolveFamily<Font>(config.menu_font, fonts, "Riffic");
	theme.optionFont = resolveFamily<Font>(config.option_font, fonts, "Halogen");
	// Pre-v4 projects carry no music_font; default to the mplus family.
	theme.musicFont = resolveFamily<Font>(config.music_font ?? "", fonts, "M+ 2p");
	Object.assign(theme.primary, config.primary_color);
	Object.assign(theme.secondary, config.secondary_color);
	// Themes authored before per-surface colors (and the shipped presets) carry
	// none: an all-null modulation, which defers to the primary.
	Object.assign(theme.buttonColor, config.button_color ?? NO_MODULATION());
	Object.assign(theme.dialogueColor, config.dialogue_color ?? NO_MODULATION());
	Object.assign(theme.buttonTextColor, config.button_text_color ?? NO_MODULATION());
	Object.assign(theme.dialogueTextColor, config.dialogue_text_color ?? NO_MODULATION());
	// Presets and older projects carry no overrides: nothing pinned, which is
	// the stock pure-modulation palette.
	theme.overrides = { ...config.color_overrides };
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

/**
 * Reads a .cozy project file and applies its config to the live theme,
 * upgrading older format versions on the way in.
 */
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

	const raw = JSON.parse(new TextDecoder().decode(configBytes)) as RawConfig;
	applyConfig(migrateConfig(raw) as unknown as ThemeConfig);
}
