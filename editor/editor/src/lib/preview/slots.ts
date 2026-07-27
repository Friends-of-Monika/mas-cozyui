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

/** One-line summary of what each section covers, shown under its heading. */
export const sectionHints: Record<string, string> = {
	"Dialogue box": "The textbox during conversations and the name plate above it",
	"Buttons": "Backgrounds of the talk/choice buttons and the hotkey buttons",
	"Menu screen": "The settings screen backdrop and its curved side panel",
	"Quick menu": "Buttons in the bottom of the dialog box",
	"Text & labels": "Monika's name, settings labels and the side menu buttons",
	"Calendar": "The calendar panel, day cells, arrows and close button"
};

export const colorSlots: ColorSlot[] = [
	// textbox*[_d].svg, namebox[_d].svg
	{
		label: "Textbox fill",
		section: "Dialogue box",
		channel: "prm",
		group: "dialogue",
		light: [255, 168, 210],
		dark: [127, 52, 84]
	},
	{
		label: "Textbox border",
		section: "Dialogue box",
		channel: "prm",
		group: "dialogue",
		light: [255, 223, 238],
		dark: [43, 23, 32]
	},
	{
		label: "Textbox pattern",
		section: "Dialogue box",
		channel: "prm",
		group: "dialogue",
		light: [255, 150, 198],
		dark: [147, 67, 102]
	},
	{
		label: "Name plate (top)",
		section: "Dialogue box",
		channel: "prm",
		group: "dialogue",
		light: [255, 238, 246],
		dark: [40, 36, 38]
	},
	{
		label: "Name plate (bottom)",
		section: "Dialogue box",
		channel: "prm",
		group: "dialogue",
		light: [211, 197, 204],
		dark: [24, 22, 23]
	},

	// button/*.svg, mod_assets/buttons/**
	{ label: "Fill", section: "Buttons", channel: "prm", group: "button", light: [255, 230, 244], dark: [28, 26, 30] },
	{
		label: "Fill (hovered)",
		section: "Buttons",
		channel: "prm",
		group: "button",
		light: [255, 255, 255],
		dark: [61, 41, 50]
	},
	{
		label: "Fill (unavailable)",
		section: "Buttons",
		channel: "prm",
		group: "button",
		light: [219, 219, 219],
		dark: [28, 26, 30]
	},
	{
		label: "Border",
		section: "Buttons",
		channel: "prm",
		group: "button",
		light: [255, 189, 225],
		dark: [206, 126, 160]
	},
	// In night mode the unavailable button keeps the idle fill (a near-black fill
	// cannot be greyed out visibly), so this border is what marks it out.
	{
		label: "Border (unavailable)",
		section: "Buttons",
		channel: "prm",
		group: "button",
		light: [191, 191, 191],
		dark: [140, 140, 140]
	},
	{
		label: "Inner glow (hovered)",
		section: "Buttons",
		channel: "prm",
		group: "button",
		light: [255, 225, 241],
		dark: [216, 151, 179]
	},

	// menu_bg[_d].svg, overlay/game_menu[_d].svg
	{
		label: "Backdrop fill",
		section: "Menu screen",
		channel: "prm",
		group: "menu",
		light: [255, 255, 255],
		dark: [31, 31, 31]
	},
	{
		label: "Backdrop pattern",
		section: "Menu screen",
		channel: "prm",
		group: "menu",
		light: [255, 219, 240],
		dark: [58, 39, 47]
	},
	{
		label: "Side panel fill",
		section: "Menu screen",
		channel: "prm",
		group: "menu",
		light: [255, 230, 244],
		dark: [28, 26, 30]
	},
	{
		label: "Side panel border",
		section: "Menu screen",
		channel: "prm",
		group: "menu",
		light: [255, 189, 225],
		dark: [206, 126, 160]
	},

	// quick_button_text
	scdSlot("Quick menu", "Text", [85, 34, 34], [235, 173, 185]),
	scdSlot("Quick menu", "Text (hovered)", [255, 204, 204], [252, 232, 236]),
	scdSlot("Quick menu", "Text (unavailable)", [170, 102, 102], [170, 102, 102]),

	// say_label, menu_title, section + slider labels, menu_button_text. The text
	// fill and idle outline share their bases with the side menu buttons, so one
	// control covers both.
	scdSlot("Text & labels", "Text fill", [255, 255, 255], [250, 235, 241]),
	scdSlot("Text & labels", "Text outline", [187, 85, 153], [126, 53, 104]),
	scdSlot("Text & labels", "Menu button outline (hovered)", [255, 170, 204], [201, 105, 172]),
	scdSlot("Text & labels", "Menu button outline (current)", [255, 204, 238], [186, 120, 166]),

	// calendar/*.svg. Fills are the calendar's own PRM group; the borders/arrows/
	// close mark are secondary (scd), like every other outline. The day-cell fills
	// are transparent (only the border shows), so there is no cell-fill control.
	{ label: "Panel fill", section: "Calendar", channel: "prm", group: "calendar", light: [255, 230, 244], dark: [150, 114, 133] },
	{ label: "Header fill", section: "Calendar", channel: "prm", group: "calendar", light: [255, 176, 237], dark: [150, 87, 130] },
	{ label: "Close button", section: "Calendar", channel: "prm", group: "calendar", light: [255, 216, 235], dark: [150, 107, 128] },
	// The grey wash over out-of-month (inactive) day cells. Its base is neutral, so
	// it stays grey under any modulation until pinned to a color of its own.
	{ label: "Inactive cells", section: "Calendar", channel: "prm", group: "calendar", light: [161, 161, 161], dark: [95, 80, 88] },
	// The shared border of the panel, day cells and weekday headers.
	scdSlot("Calendar", "Cell border", [250, 153, 228], [146, 76, 125]),
	scdSlot("Calendar", "Today border", [186, 83, 152], [84, 32, 84]),
	scdSlot("Calendar", "Today border (hovered)", [255, 167, 203], [228, 145, 206]),
	scdSlot("Calendar", "Arrows", [197, 95, 163], [119, 52, 94]),
	scdSlot("Calendar", "Arrows (hovered)", [230, 119, 200], [139, 64, 114]),
	scdSlot("Calendar", "Close mark", [255, 160, 225], [150, 79, 123])
];
