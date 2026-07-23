import { customFont } from "#lib/preview/fonts.svelte";
import { type MainFont, theme } from "#lib/preview/theme.svelte";

import type { MacroParams } from "./macros";

// Main font file sets (mirrors the main_font block of the theme JSONs)
export const MAIN_FONTS: Record<MainFont, { regular: string; italic: string; bold: string; boldItalic: string }> = {
	Nunito: {
		regular: "%SUBMOD_DIR%/fonts/Nunito-SemiBold.ttf",
		italic: "%SUBMOD_DIR%/fonts/Nunito-SemiBoldItalic.ttf",
		bold: "%SUBMOD_DIR%/fonts/Nunito-Bold.ttf",
		boldItalic: "%SUBMOD_DIR%/fonts/Nunito-BoldItalic.ttf"
	},
	Asap: {
		regular: "%SUBMOD_DIR%/fonts/Asap-Medium.ttf",
		italic: "%SUBMOD_DIR%/fonts/Asap-MediumItalic.ttf",
		bold: "%SUBMOD_DIR%/fonts/Asap-Bold.ttf",
		boldItalic: "%SUBMOD_DIR%/fonts/Asap-BoldItalic.ttf"
	}
};

// DDLC base-game font paths for the menu/option fonts
export const DDLC_FONT_PATH: Record<string, string> = {
	Riffic: "gui/font/RifficFree-Bold.ttf",
	Halogen: "gui/font/Halogen.ttf",
	Nunito: "%SUBMOD_DIR%/fonts/Nunito-SemiBold.ttf",
	Asap: "%SUBMOD_DIR%/fonts/Asap-Medium.ttf"
};

// Offset/kerning values not yet exposed in the editor UI (Default theme values)
export const DEFAULT_METRICS = {
	mainFontKerning: 0.0,
	dialogueVerticalOffset: -3,
	dialogueLineSpacing: -1,
	buttonHeightAdjustment: -4,
	buttonTextVerticalOffset: 1
};

// A custom font is a single .ttf, so every style maps to the same file. Unlike
// the built-in fonts (shipped statically under %SUBMOD_DIR%/fonts), custom fonts
// ride inside the theme package and the submod extracts them to themes/active/,
// so they are referenced from there (see ThemeManager._install_theme).
function customPath(family: string): string | undefined {
	const font = customFont(family);
	return font ? `%SUBMOD_DIR%/themes/active/fonts/${font.file}` : undefined;
}

// Resolves the main_font style set for a family, built-in or custom.
function mainFontSet(family: string): { regular: string; italic: string; bold: string; boldItalic: string } {
	if (family in MAIN_FONTS) return MAIN_FONTS[family as MainFont];
	const path = customPath(family);
	if (path) return { regular: path, italic: path, bold: path, boldItalic: path };
	return MAIN_FONTS.Nunito;
}

// Resolves a single-file font path (menu/option) for a family, built-in or custom.
function fontPath(family: string, fallback: string): string {
	return DDLC_FONT_PATH[family] ?? customPath(family) ?? fallback;
}

/** Live theme state mapped to CUI_* macro values, at the given render scale. */
export function themeParams(scale = 1): MacroParams {
	const main = mainFontSet(theme.mainFont);
	return {
		primary: theme.primary,
		secondary: theme.secondary,
		buttonColor: theme.buttonColor,
		dialogueColor: theme.dialogueColor,
		buttonTextColor: theme.buttonTextColor,
		dialogueTextColor: theme.dialogueTextColor,
		overrides: theme.overrides,
		buttonRounding: theme.buttonRounding,
		frameRounding: theme.frameRounding,
		dialogueRounding: theme.dialogueRounding,
		menuPatternShape: theme.menuPatternShape,
		dialoguePatternShape: theme.dialoguePatternShape,
		mainFontRegular: main.regular,
		mainFontItalic: main.italic,
		mainFontBold: main.bold,
		mainFontBoldItalic: main.boldItalic,
		mainFontName: theme.mainFont,
		menuFont: fontPath(theme.menuFont, DDLC_FONT_PATH.Riffic),
		optionFont: fontPath(theme.optionFont, DDLC_FONT_PATH.Halogen),
		...DEFAULT_METRICS,
		scale
	};
}
