import { Hsluv } from "hsluv";

/**
 * HSLuv modulation of a base RGB color, mirroring the CUI_PRM_COLOR /
 * CUI_SCD_COLOR build-time macros (see scripts/build-themes.py in the
 * repository root): hue is replaced, saturation is multiplied, lightness
 * is shifted.
 */
export interface ColorModulation {
	/** Replacement hue, 0-360 (null leaves the base color untouched) */
	h: number | null;
	/** Saturation multiplier (null leaves the base color untouched) */
	s: number | null;
	/** Lightness shift, -1..1 (null leaves the base color untouched) */
	l: number | null;
}

/**
 * Surfaces are grouped so that the same base RGB appearing in different assets
 * stays separately addressable: the button idle fill and the menu panel fill
 * are both (255, 230, 244), but they are distinct colors to the user.
 */
export const colorGroups = ["dialogue", "dialogueText", "button", "buttonText", "menu", "calendar"] as const;
export type ColorGroup = (typeof colorGroups)[number];

/**
 * Maps a theme template path to the surface group its CUI_PRM_COLOR bases
 * belong to. Templates outside a group (text styles, misc assets) share the
 * ungrouped keyspace, so preview and export stay in agreement.
 *
 * The text groups are absent here on purpose: every text style lives in the one
 * definitions.rpy, so a path can't tell them apart. They are addressed by their
 * own macros instead (CUI_DLG_TEXT_COLOR / CUI_BTN_TEXT_COLOR).
 */
export function groupForPath(path: string): ColorGroup | null {
	if (path.includes("textbox") || path.includes("namebox")) return "dialogue";
	// The choice buttons (button/) plus the hotkey and mode-island backgrounds,
	// which sit loose in mod_assets/ but are button surfaces all the same.
	if (/\bbuttons?\/|\b(hkb|island)_/.test(path)) return "button";
	if (path.includes("menu_bg") || path.includes("game_menu")) return "menu";
	if (path.includes("calendar")) return "calendar";
	return null;
}

/** Which macro derived a color: CUI_PRM_COLOR or CUI_SCD_COLOR. */
export type ColorChannel = "prm" | "scd";

/**
 * A modulation only takes effect when all three parts are set (same rule as the
 * build script); an all-null one leaves its bases alone. The per-surface colors
 * use that to mean "no color of my own, follow the primary".
 */
export function isModulated(mod: ColorModulation | null | undefined): mod is ColorModulation {
	return !!mod && mod.h !== null && mod.s !== null && mod.l !== null;
}

/**
 * The modulations a theme applies, in the order they take precedence: the
 * per-surface button/dialogue colors override the primary for their own group,
 * everything else follows the primary (or the secondary, for text styles).
 */
export interface ThemeModulations {
	primary: ColorModulation;
	secondary: ColorModulation;
	buttonColor?: ColorModulation;
	dialogueColor?: ColorModulation;
	buttonTextColor?: ColorModulation;
	dialogueTextColor?: ColorModulation;
	calendarColor?: ColorModulation;
}

// The per-surface color each group defers to when it carries one of its own.
const groupModulation: Record<string, keyof ThemeModulations> = {
	button: "buttonColor",
	dialogue: "dialogueColor",
	buttonText: "buttonTextColor",
	dialogueText: "dialogueTextColor",
	calendar: "calendarColor"
};

/** Picks the modulation that governs one base, given its channel and group. */
export function modulationFor(
	mods: ThemeModulations,
	channel: ColorChannel,
	group: ColorGroup | null
): ColorModulation {
	if (channel === "scd") return mods.secondary;
	const key = group ? groupModulation[group] : undefined;
	const own = key ? mods[key] : undefined;
	return isModulated(own as ColorModulation) ? (own as ColorModulation) : mods.primary;
}

/**
 * Identifies one derived color - the result of CUI_PRM_COLOR/CUI_SCD_COLOR on a
 * base, within a surface group - so the palette can pin it to an absolute value
 * instead of whatever the modulation would produce.
 */
export function overrideKey(channel: ColorChannel, group: ColorGroup | null, r: number, g: number, b: number): string {
	return `${channel}:${group ?? "base"}:${r},${g},${b}`;
}

function clamp(value: number, lower: number, upper: number): number {
	return Math.min(Math.max(value, lower), upper);
}

export function toHexByte(value: number): string {
	return Math.round(clamp(value, 0, 255))
		.toString(16)
		.padStart(2, "0");
}

function rgbToHsluv(r: number, g: number, b: number): [number, number, number] {
	const conv = new Hsluv();
	conv.rgb_r = r / 255;
	conv.rgb_g = g / 255;
	conv.rgb_b = b / 255;
	conv.rgbToHsluv();
	return [conv.hsluv_h, conv.hsluv_s, conv.hsluv_l];
}

/**
 * Derives a modulation from an absolute picked color, relative to an anchor
 * color (a well-known base color from the SVG templates): applying the
 * resulting modulation to the anchor reproduces the picked color, and shifts
 * every other themed color consistently.
 */
export function modulationFromColor(hex: string, anchor: [number, number, number]): ColorModulation {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);

	const [h, s, l] = rgbToHsluv(r, g, b);
	const [, s0, l0] = rgbToHsluv(...anchor);

	return {
		h,
		s: s0 === 0 ? 1 : s / s0,
		l: (l - l0) / 100
	};
}

/**
 * Applies a color modulation to a base RGB color (0-255 components) and
 * returns a CSS hex color. Alpha (0-255), when given, is appended as-is.
 */
export function modulate(r: number, g: number, b: number, mod: ColorModulation, a?: number): string {
	let rgb: [number, number, number] = [r, g, b];

	// Same rule as the build script: modulate only when all three parts are set
	if (mod.h !== null && mod.s !== null && mod.l !== null) {
		const conv = new Hsluv();
		conv.rgb_r = r / 255;
		conv.rgb_g = g / 255;
		conv.rgb_b = b / 255;
		conv.rgbToHsluv();

		conv.hsluv_h = clamp(mod.h, 0, 360);
		conv.hsluv_s = clamp(conv.hsluv_s * mod.s, 0, 100);
		conv.hsluv_l = clamp(conv.hsluv_l + mod.l * 100, 0, 100);
		conv.hsluvToRgb();

		rgb = [conv.rgb_r * 255, conv.rgb_g * 255, conv.rgb_b * 255];
	}

	const hex = `#${toHexByte(rgb[0])}${toHexByte(rgb[1])}${toHexByte(rgb[2])}`;
	return a === undefined ? hex : hex + toHexByte(a);
}
