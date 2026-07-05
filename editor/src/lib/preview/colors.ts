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

function clamp(value: number, lower: number, upper: number): number {
	return Math.min(Math.max(value, lower), upper);
}

function toHexByte(value: number): string {
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
