import type { ColorModulation } from "./colors";
import {
	type MainFont,
	type MenuFont,
	type MusicFont,
	NO_MODULATION,
	type OptionFont,
	type PatternShape,
	mainFonts,
	menuFonts,
	musicFonts,
	optionFonts,
	theme
} from "./theme.svelte";

/** Subset of the theme definition JSON (themes/*.json) the preview uses */
interface ThemeDefinition {
	name: string;
	id: string;
	button_rounding: number;
	frame_rounding: number;
	dialogue_rounding: number;
	menu_pattern_shape: string;
	dialogue_pattern_shape: string;
	main_font: { regular: string };
	menu_font: string;
	option_font: string;
	/** Optional in the shipped presets, which default to the mplus music font. */
	music_font?: string;
	primary_color: ColorModulation;
	secondary_color: ColorModulation;
	/** Optional in the shipped presets, which all follow the primary color. */
	button_color?: ColorModulation;
	dialogue_color?: ColorModulation;
	button_text_color?: ColorModulation;
	dialogue_text_color?: ColorModulation;
}

export interface ThemePreset {
	id: string;
	name: string;
	primary: ColorModulation;
	secondary: ColorModulation;
	buttonColor: ColorModulation;
	dialogueColor: ColorModulation;
	buttonTextColor: ColorModulation;
	dialogueTextColor: ColorModulation;
	buttonRounding: number;
	frameRounding: number;
	dialogueRounding: number;
	menuPatternShape: PatternShape;
	dialoguePatternShape: PatternShape;
	mainFont: MainFont;
	menuFont: MenuFont;
	optionFont: OptionFont;
	musicFont: MusicFont;
}

// Maps a font file path from the theme definition to a registered family name
function familyOf<T extends string>(path: string, families: readonly T[], fallback: T): T {
	return families.find((family) => path.includes(family)) ?? fallback;
}

const definitions = import.meta.glob<ThemeDefinition>("$themes/*.json", {
	eager: true,
	import: "default"
});

// Same ordering as the in-game theme list: Default, Classic, then alphabetical
function order(preset: ThemePreset): string {
	if (preset.name === "Default") return "  " + preset.name;
	if (preset.name === "Classic") return " " + preset.name;
	return preset.name;
}

export const presets: ThemePreset[] = Object.values(definitions)
	.map((def) => ({
		id: def.id,
		name: def.name,
		primary: { ...def.primary_color },
		secondary: { ...def.secondary_color },
		buttonColor: { ...(def.button_color ?? NO_MODULATION()) },
		dialogueColor: { ...(def.dialogue_color ?? NO_MODULATION()) },
		buttonTextColor: { ...(def.button_text_color ?? NO_MODULATION()) },
		dialogueTextColor: { ...(def.dialogue_text_color ?? NO_MODULATION()) },
		buttonRounding: def.button_rounding,
		frameRounding: def.frame_rounding,
		dialogueRounding: def.dialogue_rounding,
		menuPatternShape: def.menu_pattern_shape as PatternShape,
		dialoguePatternShape: def.dialogue_pattern_shape as PatternShape,
		mainFont: familyOf(def.main_font.regular, mainFonts, "Nunito"),
		menuFont: familyOf(def.menu_font, menuFonts, "Riffic"),
		optionFont: familyOf(def.option_font, optionFonts, "Halogen"),
		musicFont: familyOf(def.music_font ?? "", musicFonts, "M+ 2p")
	}))
	.sort((a, b) => order(a).localeCompare(order(b)));

/** Applies a preset to the live theme state (by preset id). */
export function applyPreset(id: string) {
	const preset = presets.find((p) => p.id === id);
	if (!preset) return;
	theme.name = preset.name;
	Object.assign(theme.primary, preset.primary);
	Object.assign(theme.secondary, preset.secondary);
	Object.assign(theme.buttonColor, preset.buttonColor);
	Object.assign(theme.dialogueColor, preset.dialogueColor);
	Object.assign(theme.buttonTextColor, preset.buttonTextColor);
	Object.assign(theme.dialogueTextColor, preset.dialogueTextColor);
	theme.buttonRounding = preset.buttonRounding;
	theme.frameRounding = preset.frameRounding;
	theme.dialogueRounding = preset.dialogueRounding;
	theme.menuPatternShape = preset.menuPatternShape;
	theme.dialoguePatternShape = preset.dialoguePatternShape;
	theme.mainFont = preset.mainFont;
	theme.menuFont = preset.menuFont;
	theme.optionFont = preset.optionFont;
	theme.musicFont = preset.musicFont;
	// Presets are pure-modulation themes; drop any pinned colors from the theme
	// that was being edited so the preset shows exactly as authored.
	theme.overrides = {};
}
