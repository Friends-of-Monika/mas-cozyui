import {
	type ColorChannel,
	type ColorGroup,
	type ColorModulation,
	type ThemeModulations,
	modulate,
	modulationFor,
	overrideKey,
	toHexByte
} from "./colors";

/**
 * Values fed to the CUI_* template macros, mirroring the fields of the theme
 * definition JSONs. This is the browser port of the substitution done by
 * scripts/build-themes.py (preprocess_text_file): CUI_PRM_COLOR / CUI_SCD_COLOR
 * modulate a base RGB through the primary/secondary color, the rest are plain
 * scalar substitutions.
 */
export interface MacroParams extends ThemeModulations {
	primary: ColorModulation;
	secondary: ColorModulation;
	/**
	 * Per-surface colors overriding the primary within their own group (see
	 * modulationFor). All-null, or absent, means the group follows the primary.
	 */
	buttonColor?: ColorModulation;
	dialogueColor?: ColorModulation;
	buttonTextColor?: ColorModulation;
	dialogueTextColor?: ColorModulation;
	calendarColor?: ColorModulation;
	/**
	 * Derived colors pinned to an absolute value, keyed by overrideKey(). Set
	 * only in the "custom" palette mode; anything absent modulates as usual.
	 */
	overrides?: Record<string, string>;
	buttonRounding: number;
	frameRounding: number;
	dialogueRounding: number;
	menuPatternShape: string;
	dialoguePatternShape: string;
	// Font/offset macros (only needed when processing .rpy for export)
	mainFontRegular?: string;
	mainFontItalic?: string;
	mainFontBold?: string;
	mainFontBoldItalic?: string;
	mainFontName?: string;
	mainFontKerning?: number;
	menuFont?: string;
	optionFont?: string;
	musicFont?: string;
	calendarFont?: string;
	dialogueVerticalOffset?: number;
	dialogueLineSpacing?: number;
	buttonHeightAdjustment?: number;
	buttonTextVerticalOffset?: number;
	themeId?: string;
	themeName?: string;
	scale?: number;
}

/**
 * 9-slice border for the button backgrounds. Must be >= the rounding so the
 * stretched middle stays within the flat edge region (otherwise a curved strip
 * gets stretched and the corners warp). Clamped to the 35px source, and kept
 * >= 5 to preserve the original look at small roundings.
 */
export function buttonSlice(rounding: number): number {
	return Math.min(Math.max(rounding + 1, 5), 16);
}

function colorMacro(argStr: string, p: MacroParams, channel: ColorChannel, group: ColorGroup | null): string {
	const parts = argStr.split(",").map((s) => parseInt(s.trim(), 10));
	const [r, g, b, a] = parts;
	const alpha = parts.length === 4 ? a : undefined;

	const pinned = p.overrides?.[overrideKey(channel, group, r, g, b)];
	if (pinned) return alpha === undefined ? pinned : pinned + toHexByte(alpha);

	return modulate(r, g, b, modulationFor(p, channel, group), alpha);
}

/**
 * Applies the CUI_* macros in a template string, returning the final text.
 * `group` is the template's surface group (see groupForPath): it scopes the
 * per-color overrides and selects the per-surface button/dialogue color.
 */
export function applyMacros(text: string, p: MacroParams, group: ColorGroup | null = null): string {
	text = text.replace(/CUI_PRM_COLOR\(([^)]*)\)/g, (_m, a) => colorMacro(a, p, "prm", group));
	// Secondary bases live in the ungrouped .rpy text styles (see scd()).
	text = text.replace(/CUI_SCD_COLOR\(([^)]*)\)/g, (_m, a) => colorMacro(a, p, "scd", null));
	// The two text surfaces the palette exposes. They modulate exactly like
	// CUI_PRM_COLOR but carry their own group, because the styles that use them
	// share definitions.rpy with unrelated bases of the same value (the button
	// text idle grey is also the confirm prompt's).
	text = text.replace(/CUI_DLG_TEXT_COLOR\(([^)]*)\)/g, (_m, a) => colorMacro(a, p, "prm", "dialogueText"));
	text = text.replace(/CUI_BTN_TEXT_COLOR\(([^)]*)\)/g, (_m, a) => colorMacro(a, p, "prm", "buttonText"));

	const scale = p.scale ?? 1;
	const scalars: Record<string, string | number | undefined> = {
		"CUI_BTN_ROUNDING()": p.buttonRounding,
		"CUI_BTN_SLICE()": buttonSlice(p.buttonRounding),
		"CUI_FRM_ROUNDING()": p.frameRounding,
		"CUI_DLG_ROUNDING()": p.dialogueRounding,
		"CUI_MNU_PTSHAPE()": p.menuPatternShape,
		"CUI_DLG_PTSHAPE()": p.dialoguePatternShape,
		"CUI_SCALE()": scale,
		"CUI_SCALE_INV()": 1 / scale,
		"CUI_MAIN_FONT_REGULAR()": p.mainFontRegular,
		"CUI_MAIN_FONT_ITALIC()": p.mainFontItalic,
		"CUI_MAIN_FONT_BOLD()": p.mainFontBold,
		"CUI_MAIN_FONT_BOLD_ITALIC()": p.mainFontBoldItalic,
		"CUI_MAIN_FONT_NAME()": p.mainFontName,
		"CUI_MAIN_FONT_KERNING()": p.mainFontKerning,
		"CUI_MENU_FONT()": p.menuFont,
		"CUI_OPTION_FONT()": p.optionFont,
		"CUI_MUSIC_FONT()": p.musicFont,
		"CUI_CALENDAR_FONT()": p.calendarFont,
		"CUI_DLG_VERT_OFFSET()": p.dialogueVerticalOffset,
		"CUI_DLG_LINE_SPACING()": p.dialogueLineSpacing,
		"CUI_BTN_HEIGHT_ADJUSTMENT()": p.buttonHeightAdjustment,
		"CUI_BTN_TEXT_VERT_OFFSET()": p.buttonTextVerticalOffset,
		"CUI_THEME_ID()": p.themeId,
		"CUI_THEME_NAME()": p.themeName
	};

	for (const [macro, value] of Object.entries(scalars)) {
		if (value === undefined) continue;
		text = text.split(macro).join(String(value));
	}
	return text;
}
