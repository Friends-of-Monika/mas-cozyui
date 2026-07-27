import type { ColorModulation } from "../colors";
import type { MacroParams } from "../macros";

/** Default music-list font (base-game asset) when a theme omits music_font. */
export const DEFAULT_MUSIC_FONT = "mod_assets/font/mplus-2p-regular.ttf";

/**
 * The theme definition JSON (themes/*.json) as the builder reads it. Matches the
 * editor's ThemeConfig, minus the editor-only extras; the per-surface color
 * fields are optional (the shipped presets omit them and follow the primary).
 */
export interface ThemeDefinition {
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
	/** Optional: the shipped presets omit it and fall back to the mplus default. */
	music_font?: string;
	/** Optional: the shipped presets omit it and fall back to the main font. */
	calendar_font?: string;
	/** Optional: the calendar's text color; presets omit it (defaults to black). */
	calendar_text_color?: string;
	main_font_kerning: number;
	dialogue_vertical_offset: number;
	dialogue_line_spacing: number;
	button_height_adjustment: number;
	button_text_vertical_offset: number;
	primary_color: ColorModulation;
	secondary_color: ColorModulation;
	button_color?: ColorModulation;
	dialogue_color?: ColorModulation;
	button_text_color?: ColorModulation;
	dialogue_text_color?: ColorModulation;
	calendar_color?: ColorModulation;
}

/** Maps a theme definition to the CUI_* macro values, at a given render scale. */
export function definitionToMacroParams(
	def: ThemeDefinition,
	opts: { scale: number; themeId: string; themeName: string; mainFontName: string }
): MacroParams {
	return {
		primary: def.primary_color,
		secondary: def.secondary_color,
		buttonColor: def.button_color,
		dialogueColor: def.dialogue_color,
		buttonTextColor: def.button_text_color,
		dialogueTextColor: def.dialogue_text_color,
		calendarColor: def.calendar_color,
		buttonRounding: def.button_rounding,
		frameRounding: def.frame_rounding,
		dialogueRounding: def.dialogue_rounding,
		menuPatternShape: def.menu_pattern_shape,
		dialoguePatternShape: def.dialogue_pattern_shape,
		mainFontRegular: def.main_font.regular,
		mainFontItalic: def.main_font.italic,
		mainFontBold: def.main_font.bold,
		mainFontBoldItalic: def.main_font.bold_italic,
		mainFontName: opts.mainFontName,
		mainFontKerning: def.main_font_kerning,
		menuFont: def.menu_font,
		optionFont: def.option_font,
		musicFont: def.music_font ?? DEFAULT_MUSIC_FONT,
		// The calendar's text is the main font unless a theme overrides it.
		calendarFont: def.calendar_font ?? def.main_font.regular,
		calendarTextColor: def.calendar_text_color ?? "#000000",
		dialogueVerticalOffset: def.dialogue_vertical_offset,
		dialogueLineSpacing: def.dialogue_line_spacing,
		buttonHeightAdjustment: def.button_height_adjustment,
		buttonTextVerticalOffset: def.button_text_vertical_offset,
		themeId: opts.themeId,
		themeName: opts.themeName,
		scale: opts.scale
	};
}
