import type { ColorGroup } from "./colors";
import { grp, prm, scd, theme } from "./theme.svelte";

/**
 * Semantic colors for the preview, each with a light and a dark (MAS "UI:
 * Night Mode") variant. Values are the base RGBs from the CozyUI theme's
 * light/`_d` SVG assets and `.light`/`.dark` style definitions; they are run
 * through the primary/secondary modulation just like in-game.
 */
type RGB = [number, number, number] | [number, number, number, number];

function s(light: RGB, dark: RGB): string {
	const c = theme.darkMode ? dark : light;
	return scd(c[0], c[1], c[2], c[3]);
}
// Like s(), but for a base that lives in an SVG belonging to a surface group
// (see groupForPath) - it follows that group's own color when one is set.
function g(group: ColorGroup, light: RGB, dark: RGB): string {
	const c = theme.darkMode ? dark : light;
	return grp(group, c[0], c[1], c[2], c[3]);
}

export const palette = {
	// Textbox (textbox_monika[_d].svg)
	textboxFill: () => g("dialogue", [255, 168, 210], [127, 52, 84]),
	textboxStroke: () => g("dialogue", [255, 223, 238], [43, 23, 32]),
	textboxPattern: () => g("dialogue", [255, 150, 198], [147, 67, 102]),
	textboxShine: () => grp("dialogue", 255, 255, 255),

	// Namebox gradient (namebox[_d].svg)
	nameboxTop: () => g("dialogue", [255, 238, 246], [40, 36, 38]),
	nameboxBottom: () => g("dialogue", [211, 197, 204], [24, 22, 23]),

	// Dialogue text (no dark variant in-game)
	dialogueColor: () => grp("dialogueText", 248, 248, 248),
	dialogueOutline: () => grp("dialogueText", 26, 26, 26),

	// Say label / menu label (name, section + slider labels)
	labelColor: () => s([255, 255, 255], [250, 235, 241]),
	labelOutline: () => s([187, 85, 153], [126, 53, 104]),

	// Quick menu (quick_button_text)
	quickIdle: () => s([85, 34, 34], [235, 173, 185]),
	quickHover: () => s([255, 204, 204], [252, 232, 236]),
	quickInsensitive: () => s([170, 102, 102], [170, 102, 102]),

	// Button text (button_text: choice / hotkey labels)
	buttonTextIdle: () => g("buttonText", [56, 56, 56], [245, 163, 199]),
	buttonTextHover: () => g("buttonText", [255, 170, 153], [255, 189, 200]),
	buttonTextInsensitive: () => g("buttonText", [170, 170, 170, 127], [115, 115, 115, 127]),

	// Themed button backgrounds (generic button [prefix_]bg[_d].svg)
	btnIdleFill: () => g("button", [255, 230, 244], [28, 26, 30]),
	btnIdleStroke: () => g("button", [255, 189, 225], [206, 126, 160]),
	btnHoverFill: () => g("button", [255, 255, 255], [61, 41, 50]),
	btnHoverStroke: () => g("button", [255, 189, 225], [206, 126, 160]),
	btnHoverInner: () => g("button", [255, 225, 241], [216, 151, 179]),
	btnInsensitiveFill: () => g("button", [219, 219, 219], [28, 26, 30]),
	btnInsensitiveStroke: () => g("button", [191, 191, 191], [140, 140, 140]),
	btnSelectedFill: () => g("button", [255, 230, 244], [28, 26, 30]),
	btnSelectedStroke: () => g("button", [255, 170, 153], [235, 173, 185]),

	// Game-menu background (menu_bg[_d].svg + game_menu[_d].svg overlay)
	menuBgFill: () => g("menu", [255, 255, 255], [31, 31, 31]),
	menuBgPattern: () => g("menu", [255, 219, 240], [58, 39, 47]),
	menuWash: () => g("menu", [255, 255, 255], [0, 0, 0]),
	menuPanelFill: () => g("menu", [255, 230, 244], [28, 26, 30]),
	menuPanelStroke: () => g("menu", [255, 189, 225], [206, 126, 160]),

	// Nav / title (menu_button_text, menu_title)
	navColor: () => s([255, 255, 255], [250, 235, 241]),
	navOutlineIdle: () => s([187, 85, 153], [126, 53, 104]),
	navOutlineHover: () => s([255, 170, 204], [201, 105, 172]),
	navOutlineInsensitive: () => s([255, 204, 238], [186, 120, 166]),

	// Fancy check button (fancy_check[_bg][_d].svg + fancy_check_button_text)
	checkBoxStroke: () => grp("button", 0, 0, 0),
	checkSelectedFill: () => scd(255, 170, 153),
	checkBg: () => g("button", [255, 189, 225], [206, 126, 160]),
	checkLabelIdle: () => prm(191, 191, 191),
	checkLabelActive: () => prm(56, 56, 56),

	// Version tag (menu_text)
	versionColor: () => s([56, 56, 56], [245, 163, 199])
};
