/** Minimal RGBA raster the glitch shifts in place: a flat row-major buffer. */
export interface RgbaImage {
	width: number;
	data: Uint8ClampedArray | Uint8Array;
}

// Port of the glitch pixel-shift from the theme templates' .glitch files: for
// each region the source pixels are moved by (dx, dy) and alpha-blended, leaving
// a torn look. Mirrors shift_region() in the original Python builder, and runs
// identically over a canvas ImageData (editor) or a raw RGBA buffer (Node).
export function applyGlitch(image: RgbaImage, glitch: string, scale: number): void {
	const { width, data: px } = image;
	const at = (x: number, y: number) => (y * width + x) * 4;

	for (const line of glitch.split("\n")) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;
		const [x, y, w, h, dx, dy] = trimmed.split(",").map((v) => parseInt(v.trim(), 10) * scale);

		// snapshot region
		const region: [number, number, number, number][] = [];
		for (let i = 0; i < w; i++) {
			for (let j = 0; j < h; j++) {
				const o = at(x + i, y + j);
				region.push([px[o], px[o + 1], px[o + 2], px[o + 3]]);
			}
		}
		// clear source alpha
		for (let i = 0; i < w; i++) {
			for (let j = 0; j < h; j++) {
				px[at(x + i, y + j) + 3] = 0;
			}
		}
		// mix shifted region back in
		for (let i = 0; i < w; i++) {
			for (let j = 0; j < h; j++) {
				const [r, g, b, a] = region[i * h + j];
				const o = at(x + dx + i, y + dy + j);
				const la = px[o + 3];
				px[o] = r;
				px[o + 1] = g;
				px[o + 2] = b;
				px[o + 3] = Math.min(Math.max(((la * 0.25) | 0) + a, ((a * 0.25) | 0) + la), 255);
			}
		}
	}
}
