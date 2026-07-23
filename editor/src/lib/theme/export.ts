import { type MacroParams, applyGlitch, applyMacros, inlineExternalSvgs, svgSize } from "@cozyui/theme-builder";
import { zipSync } from "fflate";

import { groupForPath } from "#lib/preview/colors";
import { customFonts } from "#lib/preview/fonts.svelte";

import { themeParams } from "./params.svelte";
import { glitchLoaders, jsonLoaders, loadAll, rpyLoaders, svgLoaders } from "./templates.svelte";

export interface ExportProgress {
	phase: string;
	done: number;
	total: number;
}
type OnProgress = (p: ExportProgress) => void;

// Run async tasks with a bounded concurrency so we don't spawn hundreds of
// image decodes at once.
async function pool<T>(items: T[], limit: number, worker: (item: T) => Promise<void>): Promise<void> {
	let index = 0;
	async function run() {
		while (index < items.length) {
			const current = items[index++];
			await worker(current);
		}
	}
	await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
}

// A data: SVG can't use the page's @font-face fonts, so text-bearing templates
// (only preview.svg) need the main font embedded as a base64 @font-face.
const fontCache: Record<string, string> = {};
async function fontDataUrl(publicPath: string): Promise<string> {
	if (fontCache[publicPath]) return fontCache[publicPath];
	const buf = new Uint8Array(await (await fetch(publicPath)).arrayBuffer());
	let bin = "";
	for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
	const url = `data:font/ttf;base64,${btoa(bin)}`;
	fontCache[publicPath] = url;
	return url;
}

function bytesToDataUrl(bytes: Uint8Array): string {
	let bin = "";
	for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
	return `data:font/ttf;base64,${btoa(bin)}`;
}

async function embedFont(svg: string, params: MacroParams): Promise<string> {
	if (!svg.includes("<text")) return svg;
	const file = (params.mainFontRegular ?? "").split("/").pop();
	if (!file) return svg;
	// Custom fonts live in memory; built-ins are fetched from public/fonts.
	const custom = customFonts.find((f) => f.file === file);
	const url = custom ? bytesToDataUrl(custom.bytes) : await fontDataUrl(`/fonts/${file}`);
	const face = `<defs><style>@font-face{font-family:'${params.mainFontName}';src:url('${url}') format('truetype');}</style></defs>`;
	return svg.replace(/(<svg[^>]*>)/, `$1${face}`);
}

function decodeSvg(svg: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
	});
}

async function canvasToPng(canvas: HTMLCanvasElement): Promise<Uint8Array> {
	const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
	return new Uint8Array(await blob!.arrayBuffer());
}

// `scale` is the render (supersample) factor; `outScale` the emitted PNG factor.
// They match for theme assets. The preview passes outScale=1 so a HiDPI build
// still renders its crisp 2x image down to the default variant size - otherwise
// the submod shows a preview.png twice as large as the base theme's.
async function rasterize(svg: string, scale: number, glitch?: string, outScale = scale): Promise<Uint8Array> {
	const { width, height } = svgSize(svg);
	const img = await decodeSvg(svg);
	const canvas = document.createElement("canvas");
	canvas.width = Math.round(width * scale);
	canvas.height = Math.round(height * scale);
	const ctx = canvas.getContext("2d")!;
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

	if (glitch) {
		const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
		applyGlitch(data, glitch, scale);
		ctx.putImageData(data, 0, 0);
	}

	if (outScale === scale) return canvasToPng(canvas);

	// Downscale the supersampled render to the requested output size.
	const out = document.createElement("canvas");
	out.width = Math.round(width * outScale);
	out.height = Math.round(height * outScale);
	const octx = out.getContext("2d")!;
	octx.imageSmoothingEnabled = true;
	octx.imageSmoothingQuality = "high";
	octx.drawImage(canvas, 0, 0, out.width, out.height);
	return canvasToPng(out);
}

/**
 * Renders the live theme into a full installable theme archive, mirroring the
 * output of scripts/build-themes.py (mod/theme with every SVG rasterized to
 * PNG and CUI_* macros baked in). Reports progress so the caller can drive a
 * dialog.
 */
export async function exportTheme(name: string, scale: number, onProgress: OnProgress): Promise<Blob> {
	const baseId = name.trim().toLowerCase().replace(/\s+/g, "_") || "custom";
	// Match build-themes.py: the hi-dpi build carries an _hidpi id and a "(HiDPI)"
	// name so the submod pairs it with its base theme (theme_manager use_hidpi).
	const id = scale === 1 ? baseId : `${baseId}_hidpi`;
	const displayName = scale === 1 ? name : `${name} (HiDPI)`;
	const params = { ...themeParams(scale), themeId: id, themeName: displayName };
	const encoder = new TextEncoder();
	const files: Record<string, Uint8Array> = {};

	// 1. Load every template in parallel.
	onProgress({ phase: "Loading templates", done: 0, total: 1 });
	const [svgs, rpys, jsons, glitches] = await Promise.all([
		loadAll(svgLoaders, (done, total) => onProgress({ phase: "Loading templates", done, total })),
		loadAll(rpyLoaders),
		loadAll(jsonLoaders),
		loadAll(glitchLoaders)
	]);

	// 2. Process + rasterize SVGs to PNG.
	const svgEntries = Object.entries(svgs);
	let rendered = 0;
	await pool(svgEntries, 8, async ([path, template]) => {
		const glitchPath = path.replace(/\.svg$/, ".glitch");
		const macroed = inlineExternalSvgs(applyMacros(template, params, groupForPath(path)), svgs, params);
		const processed = await embedFont(macroed, params);
		// preview.png must stay at base variant size even in a HiDPI build.
		const outScale = path.endsWith("preview.svg") ? 1 : scale;
		const png = await rasterize(processed, scale, glitches[glitchPath], outScale);
		files[path.replace(/\.svg$/, ".png")] = png;
		onProgress({ phase: "Rendering images", done: ++rendered, total: svgEntries.length });
	});

	// 3. Process text templates (.rpy, .json) - macros only.
	onProgress({ phase: "Packaging", done: 0, total: 1 });
	for (const [path, template] of Object.entries(rpys)) {
		files[path] = encoder.encode(applyMacros(template, params));
	}
	for (const [path, template] of Object.entries(jsons)) {
		files[path] = encoder.encode(applyMacros(template, params));
	}

	// 4. Custom fonts: ship the .ttf bytes into the submod fonts/ folder so the
	// %SUBMOD_DIR%/fonts/<file> paths baked into the theme resolve in-game.
	for (const font of customFonts) files[`fonts/${font.file}`] = font.bytes;

	// 5. Zip.
	const zipped = zipSync(files, { level: 9 });
	onProgress({ phase: "Packaging", done: 1, total: 1 });
	return new Blob([zipped], { type: "application/zip" });
}
