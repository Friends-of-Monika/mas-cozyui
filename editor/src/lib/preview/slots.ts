import type { ColorChannel, ColorGroup } from "./colors";

/**
 * The derived colors the palette exposes for pinning: one entry per distinct
 * base within a channel + surface group, mirroring the palette entries in
 * palette.svelte.ts (and through them the theme templates).
 *
 * Bases shared inside a group are deliberately listed once - e.g. the button
 * idle and hover borders are the same (255, 189, 225), so they are one color to
 * the user and one entry here.
 */
export interface ColorSlot {
	label: string;
	section: string;
	channel: ColorChannel;
	group: ColorGroup | null;
	light: [number, number, number];
	dark: [number, number, number];
}

// Secondary-modulated text colors: .rpy styles, so always ungrouped.
function scdSlot(
	section: string,
	label: string,
	light: [number, number, number],
	dark: [number, number, number]
): ColorSlot {
	return { section, label, channel: "scd", group: null, light, dark };
}

export const colorSlots: ColorSlot[] = [
	// Dialogue (textbox*[_d].svg, namebox[_d].svg)
	{ label: "Box fill", section: "Dialogue", channel: "prm", group: "dialogue", light: [255, 168, 210], dark: [127, 52, 84] },
	{ label: "Box border", section: "Dialogue", channel: "prm", group: "dialogue", light: [255, 223, 238], dark: [43, 23, 32] },
	{ label: "Box pattern", section: "Dialogue", channel: "prm", group: "dialogue", light: [255, 150, 198], dark: [147, 67, 102] },
	{ label: "Name box top", section: "Dialogue", channel: "prm", group: "dialogue", light: [255, 238, 246], dark: [40, 36, 38] },
	{ label: "Name box bottom", section: "Dialogue", channel: "prm", group: "dialogue", light: [211, 197, 204], dark: [24, 22, 23] },

	// Buttons (button/*.svg, mod_assets/buttons/**)
	{ label: "Idle fill", section: "Buttons", channel: "prm", group: "button", light: [255, 230, 244], dark: [28, 26, 30] },
	{ label: "Border", section: "Buttons", channel: "prm", group: "button", light: [255, 189, 225], dark: [206, 126, 160] },
	{ label: "Hover fill", section: "Buttons", channel: "prm", group: "button", light: [255, 255, 255], dark: [61, 41, 50] },
	{ label: "Hover inner", section: "Buttons", channel: "prm", group: "button", light: [255, 225, 241], dark: [216, 151, 179] },
	{ label: "Disabled fill", section: "Buttons", channel: "prm", group: "button", light: [219, 219, 219], dark: [28, 26, 30] },

	// Menu screen (menu_bg[_d].svg, overlay/game_menu[_d].svg)
	{ label: "Backdrop fill", section: "Menu", channel: "prm", group: "menu", light: [255, 255, 255], dark: [31, 31, 31] },
	{ label: "Backdrop pattern", section: "Menu", channel: "prm", group: "menu", light: [255, 219, 240], dark: [58, 39, 47] },
	{ label: "Panel fill", section: "Menu", channel: "prm", group: "menu", light: [255, 230, 244], dark: [28, 26, 30] },
	{ label: "Panel border", section: "Menu", channel: "prm", group: "menu", light: [255, 189, 225], dark: [206, 126, 160] },

	// Quick menu (quick_button_text)
	scdSlot("Quick menu", "Idle", [85, 34, 34], [235, 173, 185]),
	scdSlot("Quick menu", "Hover", [255, 204, 204], [252, 232, 236]),
	scdSlot("Quick menu", "Disabled", [170, 102, 102], [170, 102, 102]),

	// Say label / menu titles (say_label, menu_title, slider + section labels).
	// "Text" is the same base as the nav button text, so it moves with it.
	scdSlot("Name & titles", "Text", [255, 255, 255], [250, 235, 241]),
	scdSlot("Name & titles", "Outline", [187, 85, 153], [126, 53, 104]),
	scdSlot("Name & titles", "Nav hover outline", [255, 170, 204], [201, 105, 172]),
	scdSlot("Name & titles", "Nav disabled outline", [255, 204, 238], [186, 120, 166])
];
