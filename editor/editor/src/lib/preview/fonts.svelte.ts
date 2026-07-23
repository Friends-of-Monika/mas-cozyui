// User-supplied theme fonts. A font is a single .ttf whose family name is the
// file's basename; it is registered with the document (so the preview can use
// it), listed in the side-panel font selectors, and carried in the fonts/
// folder of exported .cozy / .zip packages.
import { theme } from "./theme.svelte";

export interface CustomFont {
	family: string;
	file: string; // original filename, kept for the fonts/ folder + paths
	bytes: Uint8Array;
}

export const customFonts = $state<CustomFont[]>([]);

/** Family name shown in selectors: the filename without its .ttf extension. */
function familyFromFilename(name: string): string {
	return name.replace(/\.[tT][tT][fF]$/, "").trim() || "Font";
}

function uniqueFamily(base: string): string {
	if (!customFonts.some((f) => f.family === base)) return base;
	for (let i = 2; ; i++) {
		const candidate = `${base} ${i}`;
		if (!customFonts.some((f) => f.family === candidate)) return candidate;
	}
}

// Registers a FontFace so the family is usable in CSS immediately.
async function register(family: string, bytes: Uint8Array): Promise<void> {
	// Copy into a fresh ArrayBuffer: FontFace detaches the buffer it is given,
	// which would corrupt the Uint8Array we keep for export.
	const buffer = bytes.slice().buffer;
	const face = new FontFace(family, buffer);
	await face.load();
	document.fonts.add(face);
}

/** Adds a .ttf File, registering it and appending it to the selectors. */
export async function addFont(file: File): Promise<void> {
	if (!/\.[tT][tT][fF]$/.test(file.name)) throw new Error("Only .ttf fonts are supported");
	const bytes = new Uint8Array(await file.arrayBuffer());
	const family = uniqueFamily(familyFromFilename(file.name));
	await register(family, bytes);
	customFonts.push({ family, file: file.name, bytes });
}

/** Adds a font from raw bytes (used when opening a .cozy project). */
export async function addFontBytes(fileName: string, bytes: Uint8Array): Promise<string> {
	const family = uniqueFamily(familyFromFilename(fileName));
	await register(family, bytes);
	customFonts.push({ family, file: fileName, bytes });
	return family;
}

/** Removes a custom font, unregistering it and resetting any theme use of it. */
export function removeFont(family: string): void {
	const index = customFonts.findIndex((f) => f.family === family);
	if (index < 0) return;
	customFonts.splice(index, 1);
	document.fonts.forEach((face) => {
		if (face.family === family) document.fonts.delete(face);
	});
	if (theme.mainFont === family) theme.mainFont = "Nunito";
	if (theme.menuFont === family) theme.menuFont = "Riffic";
	if (theme.optionFont === family) theme.optionFont = "Halogen";
}

/** Looks up a custom font by family name. */
export function customFont(family: string): CustomFont | undefined {
	return customFonts.find((f) => f.family === family);
}
