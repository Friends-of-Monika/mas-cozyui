import puppeteer, { type Browser, type Page } from "puppeteer";

import { svgSize } from "../svg";

/**
 * SVG -> PNG rasterizer backed by headless Chrome, so the built theme assets go
 * through the very same Canvas path the editor's in-browser export uses. The
 * glitch pixel-shift runs in-page too, keeping parity with the editor preview.
 */
export class Rasterizer {
	private constructor(
		private browser: Browser,
		private page: Page
	) {}

	static async launch(): Promise<Rasterizer> {
		const browser = await puppeteer.launch({ headless: true, protocolTimeout: 60000 });
		const page = await browser.newPage();
		// tsx/esbuild compiles with keepNames, wrapping functions in a `__name(fn,
		// name)` helper. page.evaluate serializes our (compiled) render function, so
		// that helper must exist in the page too; a pass-through is enough. The
		// bootstrap itself is an anonymous arrow, which esbuild leaves unwrapped.
		await page.evaluate(() => {
			(globalThis as unknown as { __name: (f: unknown) => unknown }).__name = (f) => f;
		});
		return new Rasterizer(browser, page);
	}

	async close(): Promise<void> {
		await this.browser.close();
	}

	/**
	 * Renders a (fully macro-processed, font-embedded) SVG to PNG bytes. `scale`
	 * is the supersample factor; `outScale` the emitted size (they differ only
	 * for preview.png, which stays at base size in a HiDPI build). A `.glitch`
	 * region spec, when given, is applied after rasterization.
	 */
	async rasterize(svg: string, scale: number, glitch: string | null, outScale = scale): Promise<Uint8Array> {
		const { width, height } = svgSize(svg);
		const dataUrl = await this.page.evaluate(renderInPage, { svg, width, height, scale, outScale, glitch });
		return Uint8Array.from(Buffer.from(dataUrl.split(",")[1], "base64"));
	}
}

// Runs inside the page. Mirrors the editor's rasterize()/applyGlitch path: draw
// the SVG at the supersample scale, optionally tear it with the glitch spec,
// then downscale to the output size.
//
// The glitch loop is inlined rather than shared from ../glitch: serializing that
// function across (Function.prototype.toString) breaks because esbuild/tsx wraps
// named functions in a `__name(...)` helper that doesn't exist in the page. It's
// the same algorithm as applyGlitch()/the old Python shift_region() - keep them
// in step.
function renderInPage(args: {
	svg: string;
	width: number;
	height: number;
	scale: number;
	outScale: number;
	glitch: string | null;
}): Promise<string> {
	const { svg, width, height, scale, outScale, glitch } = args;
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			try {
				const canvas = document.createElement("canvas");
				canvas.width = Math.round(width * scale);
				canvas.height = Math.round(height * scale);
				const ctx = canvas.getContext("2d")!;
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

				if (glitch) {
					const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
					const px = data.data;
					const cw = data.width;
					const at = (x: number, y: number) => (y * cw + x) * 4;
					for (const line of glitch.split("\n")) {
						const trimmed = line.trim();
						if (!trimmed || trimmed.startsWith("#")) continue;
						const [x, y, w, h, dx, dy] = trimmed.split(",").map((v) => parseInt(v.trim(), 10) * scale);
						const region: [number, number, number, number][] = [];
						for (let i = 0; i < w; i++)
							for (let j = 0; j < h; j++) {
								const o = at(x + i, y + j);
								region.push([px[o], px[o + 1], px[o + 2], px[o + 3]]);
							}
						for (let i = 0; i < w; i++) for (let j = 0; j < h; j++) px[at(x + i, y + j) + 3] = 0;
						for (let i = 0; i < w; i++)
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
					ctx.putImageData(data, 0, 0);
				}

				if (outScale === scale) {
					resolve(canvas.toDataURL("image/png"));
					return;
				}

				const out = document.createElement("canvas");
				out.width = Math.round(width * outScale);
				out.height = Math.round(height * outScale);
				const octx = out.getContext("2d")!;
				octx.imageSmoothingEnabled = true;
				octx.imageSmoothingQuality = "high";
				octx.drawImage(canvas, 0, 0, out.width, out.height);
				resolve(out.toDataURL("image/png"));
			} catch (e) {
				reject(e instanceof Error ? e : new Error(String(e)));
			}
		};
		img.onerror = () => reject(new Error("SVG decode failed"));
		img.src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
	});
}
