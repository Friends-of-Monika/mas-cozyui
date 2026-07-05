/**
 * MAS screen geometry (1280x720 stage).
 */
export const STAGE_W = 1280;
export const STAGE_H = 720;

// style window: ysize gui.textbox_height (182), yalign gui.textbox_yalign (0.99)
export const TEXTBOX_WINDOW_H = 182;
export const TEXTBOX_WINDOW_TOP = Math.round((STAGE_H - TEXTBOX_WINDOW_H) * 0.99);

// textbox_monika.svg canvas is 900x146, bottom-aligned and centered in the window
export const TEXTBOX_W = 900;
export const TEXTBOX_H = 146;
export const TEXTBOX_LEFT = (STAGE_W - TEXTBOX_W) / 2;
export const TEXTBOX_TOP = TEXTBOX_WINDOW_TOP + TEXTBOX_WINDOW_H - TEXTBOX_H;

// style namebox: xpos 350 (center anchor), ypos -3 (window-relative), 168x39
export const NAMEBOX_W = 168;
export const NAMEBOX_H = 39;
export const NAMEBOX_CENTER_X = 350;
export const NAMEBOX_TOP = TEXTBOX_WINDOW_TOP - 3;

// style say_dialogue: xpos 268, ypos 62 (window-relative), xsize 744, size 24
export const DIALOGUE_X = 268;
export const DIALOGUE_TOP = TEXTBOX_WINDOW_TOP + 62;
export const DIALOGUE_W = 744;
export const DIALOGUE_TEXT_SIZE = 24;

// screen hkb_overlay: vbox xpos 0.05, yanchor 1.0, ypos 715, spacing 5; buttons 120x35
export const HKB_LEFT = Math.round(STAGE_W * 0.05);
export const HKB_BOTTOM = 715;
export const HKB_BTN_W = 120;
export const HKB_BTN_H = 35;
export const HKB_SPACING = 5;

// screen quick_menu: hbox xalign 0.5, yalign 0.995; text size 14;
// quick_button borders give 5px left/right padding (10px between labels).
// Glyphs sit just above the textbox bottom border (Ren'Py line boxes carry
// internal leading), so anchor the row to the border instead of 0.995*720.
export const QUICK_TEXT_SIZE = 14;
export const QUICK_GAP = 10;
export const QUICK_BOTTOM = TEXTBOX_WINDOW_TOP + TEXTBOX_WINDOW_H - 8;

// Talk prompt menu
export const MENU_LEFT = 750;
export const MENU_TOP = 116;
export const MENU_BTN_W = 420;
export const MENU_BTN_H = 36;
export const MENU_SPACING = 9;
export const MENU_TEXT_SIZE = 22;
