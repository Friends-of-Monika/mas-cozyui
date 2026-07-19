import { type ColorModulation, modulate } from "./colors";

// "none" resolves to an empty #none def in the textbox SVGs -> no pattern, plain
// primary fill. Only the dialogue selector exposes it (menu_bg has no #none def).
export const patternShapes = ["none", "dot", "heart", "rhombus", "sparkle", "star"] as const;
export type PatternShape = (typeof patternShapes)[number];

// Font families registered in app.css; Riffic/Halogen come from a local
// DDLC extraction and gracefully fall back to Nunito when absent
export const mainFonts = ["Nunito", "Asap"] as const;
export const menuFonts = ["Riffic", "Nunito", "Asap"] as const;
export const optionFonts = ["Halogen", "Nunito", "Asap"] as const;
export type MainFont = (typeof mainFonts)[number];
export type MenuFont = (typeof menuFonts)[number];
export type OptionFont = (typeof optionFonts)[number];

/**
 * Live-editable theme state, mirroring the fields of the theme definition
 * JSONs in themes/. Defaults are the Mint theme values (the reference
 * screenshot look); Default theme uses null modulations (stock pink).
 */
export const theme = $state({
	name: "Custom",
	primary: { h: 150, s: 0.33, l: 0.0 } as ColorModulation,
	secondary: { h: 138, s: 0.58, l: 0.0 } as ColorModulation,
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
	// MAS "UI: Night Mode": swaps UI elements to their dark variants
	darkMode: false
});

/** CUI_PRM_COLOR equivalent: base RGB modulated by the primary color */
export function prm(r: number, g: number, b: number, a?: number): string {
	return modulate(r, g, b, theme.primary, a);
}

/** CUI_SCD_COLOR equivalent: base RGB modulated by the secondary color */
export function scd(r: number, g: number, b: number, a?: number): string {
	return modulate(r, g, b, theme.secondary, a);
}
