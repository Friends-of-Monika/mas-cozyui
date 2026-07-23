/**
 * Builds a CSS text-shadow value approximating a Ren'Py text outline: shadow
 * copies of the glyphs sampled evenly around a circle.
 *
 * A square grid only lands on integer offsets, so a fractional width leaves
 * the cardinal directions uncovered and the outline drifts toward the glyph
 * corners. Sampling a circle keeps it symmetric at any width, fractions
 * included.
 */
export function outlineShadow(color: string, radius: number, steps = 16): string {
	const parts: string[] = [];
	for (let i = 0; i < steps; i++) {
		const angle = (i / steps) * Math.PI * 2;
		const dx = (Math.cos(angle) * radius).toFixed(2);
		const dy = (Math.sin(angle) * radius).toFixed(2);
		parts.push(`${dx}px ${dy}px 0 ${color}`);
	}
	return parts.join(", ");
}

/** Layers multiple outlines (Ren'Py allows several, e.g. a thick + thin one). */
export function outlineShadows(layers: [color: string, radius: number][]): string {
	return layers.map(([color, radius]) => outlineShadow(color, radius)).join(", ");
}
