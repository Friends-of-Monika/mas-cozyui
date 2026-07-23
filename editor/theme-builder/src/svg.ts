import { groupForPath } from "./colors";
import { type MacroParams, applyMacros } from "./macros";

/** Reads the width/height off an <svg> root element (0 when absent). */
export function svgSize(svg: string): { width: number; height: number } {
	const w = svg.match(/<svg[^>]*\bwidth="([\d.]+)"/);
	const h = svg.match(/<svg[^>]*\bheight="([\d.]+)"/);
	return { width: w ? parseFloat(w[1]) : 0, height: h ? parseFloat(h[1]) : 0 };
}

// Gives an SVG an explicit viewBox from its width/height when it lacks one, so
// that preserveAspectRatio on a referencing <image> has a defined aspect ratio
// (without it, browsers stretch the image to fill).
export function ensureViewBox(svg: string): string {
	if (/\bviewBox=/.test(svg)) return svg;
	const { width, height } = svgSize(svg);
	if (!width || !height) return svg;
	return svg.replace(/<svg\b/, `<svg viewBox="0 0 ${width} ${height}"`);
}

// preview.svg embeds another template by relative path (an <image> pointing at
// replacers/gui/textbox.svg). A standalone data: SVG can't resolve that, so we
// inline the referenced template (macro-processed) as its own data: URI.
export function inlineExternalSvgs(svg: string, svgs: Record<string, string>, params: MacroParams): string {
	return svg.replace(/xlink:href="([^"#][^"]*\.svg)"/g, (match, ref) => {
		const template = svgs[ref];
		if (!template) return match;
		// The inlined template keeps its own surface group, not the host's.
		const processed = ensureViewBox(applyMacros(template, params, groupForPath(ref)));
		return `xlink:href="data:image/svg+xml;utf8,${encodeURIComponent(processed)}"`;
	});
}
