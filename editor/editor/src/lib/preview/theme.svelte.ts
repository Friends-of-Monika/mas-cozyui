import {
	type ColorChannel,
	type ColorGroup,
	type ColorModulation,
	modulate,
	modulationFor,
	overrideKey,
	toHexByte
} from "./colors";

/** An unset per-surface color: falls back to the primary modulation. */
export const NO_MODULATION = (): ColorModulation => ({ h: null, s: null, l: null });

// "none" resolves to an empty #none def in the textbox SVGs -> no pattern, plain
// primary fill. Only the dialogue selector exposes it (menu_bg has no #none def).
export const patternShapes = ["none", "dot", "heart", "rhombus", "sparkle", "star"] as const;
export type PatternShape = (typeof patternShapes)[number];

// Font families registered in app.css; Riffic/Halogen come from a local
// DDLC extraction and gracefully fall back to Nunito when absent
export const mainFonts = ["Nunito", "Asap"] as const;
export const menuFonts = ["Riffic", "Nunito", "Asap"] as const;
export const optionFonts = ["Halogen", "Nunito", "Asap"] as const;
// Music-list font. "M+ 2p" is the base-game mplus-2p (broad glyph coverage,
// the historical default); it owns only the Latin range in-game, with CJK
// fallbacks behind it (see definitions.rpy).
export const musicFonts = ["M+ 2p", "Nunito", "Asap"] as const;
export type MainFont = (typeof mainFonts)[number];
export type MenuFont = (typeof menuFonts)[number];
export type OptionFont = (typeof optionFonts)[number];
export type MusicFont = (typeof musicFonts)[number];

/**
 * Live-editable theme state, mirroring the fields of the theme definition
 * JSONs in themes/. Defaults are the Mint theme values (the reference
 * screenshot look); Default theme uses null modulations (stock pink).
 */
export const theme = $state({
	name: "Custom",
	primary: { h: 150, s: 0.33, l: 0.0 } as ColorModulation,
	secondary: { h: 138, s: 0.58, l: 0.0 } as ColorModulation,
	// Per-surface colors. Each replaces the primary modulation for its own
	// group's bases, so the buttons or the dialogue box can carry a color of
	// their own; all-null (the default) means "follow the primary color".
	buttonColor: NO_MODULATION(),
	dialogueColor: NO_MODULATION(),
	// Text colors work the same way, over the dialogue/button text styles.
	buttonTextColor: NO_MODULATION(),
	dialogueTextColor: NO_MODULATION(),
	buttonRounding: 3,
	frameRounding: 3,
	dialogueRounding: 10,
	menuPatternShape: "dot" as PatternShape,
	dialoguePatternShape: "dot" as PatternShape,
	// Font fields hold a family name: a built-in (MainFont/MenuFont/OptionFont)
	// or a user-added custom font family (see fonts.svelte).
	mainFont: "Nunito" as string,
	menuFont: "Riffic" as string,
	optionFont: "Halogen" as string,
	musicFont: "M+ 2p" as string,
	// MAS "UI: Night Mode": swaps UI elements to their dark variants
	darkMode: false,
	// Derived colors pinned to an absolute "#rrggbb", keyed by overrideKey().
	// Anything absent falls back to the primary modulation, so an empty map is
	// the stock CozyUI palette.
	overrides: {} as Record<string, string>
});

/**
 * One derived color: the pinned override when the palette has one, otherwise
 * the modulation governing the base (see modulationFor) applied to it.
 */
function derive(channel: ColorChannel, group: ColorGroup | null, r: number, g: number, b: number, a?: number): string {
	const pinned = theme.overrides[overrideKey(channel, group, r, g, b)];
	if (pinned) return a === undefined ? pinned : pinned + toHexByte(a);
	return modulate(r, g, b, modulationFor(theme, channel, group), a);
}

/** CUI_PRM_COLOR equivalent for a base belonging to a surface group */
export function grp(group: ColorGroup | null, r: number, g: number, b: number, a?: number): string {
	return derive("prm", group, r, g, b, a);
}

/** CUI_PRM_COLOR equivalent for a base outside any surface group */
export function prm(r: number, g: number, b: number, a?: number): string {
	return derive("prm", null, r, g, b, a);
}

/**
 * CUI_SCD_COLOR equivalent. Secondary bases all live in the .rpy text styles,
 * which carry no surface group, so they share the ungrouped keyspace.
 */
export function scd(r: number, g: number, b: number, a?: number): string {
	return derive("scd", null, r, g, b, a);
}
