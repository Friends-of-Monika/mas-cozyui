import * as fontkit from "fontkit";
import { readFileSync } from "node:fs";
import { basename, join } from "node:path";

/** The %SUBMOD_DIR% placeholder theme font paths use for repo-relative assets. */
const SUBMOD_PREFIX = "%SUBMOD_DIR%/";

/**
 * Resolves a theme font path to an on-disk path. Shipped fonts are addressed as
 * %SUBMOD_DIR%/fonts/<file>; anything else (base-game gui/font/... paths) has no
 * source here and is returned unresolved (undefined).
 */
export function resolveFontPath(fontsDir: string, fontRef: string): string | undefined {
	if (!fontRef.startsWith(SUBMOD_PREFIX)) return undefined;
	const rel = fontRef.slice(SUBMOD_PREFIX.length); // e.g. "fonts/Nunito-SemiBold.ttf"
	return join(fontsDir, basename(rel));
}

/** Reads the font's family name (mirrors freetype's family_name in the old builder). */
export function fontFamilyName(path: string): string {
	const font = fontkit.openSync(path) as fontkit.Font;
	return font.familyName;
}

/** Reads a font file as a base64 data: URL for @font-face embedding. */
export function fontDataUrl(path: string): string {
	return `data:font/ttf;base64,${readFileSync(path).toString("base64")}`;
}
