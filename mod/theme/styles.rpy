################################################################################
#
# Copyright (c) 2020-2021 Dominus Iniquitatis <zerosaiko@gmail.com>
# Copyright (c) 2026 Friends of Monika
#
# See LICENSE file for the licensing information
#
################################################################################

################################################################################
# Definitions
################################################################################
define mas_ui.light_button_text_idle_color        = cozy_ui.button_text.light.idle_color
define mas_ui.light_button_text_hover_color       = cozy_ui.button_text.light.hover_color
define mas_ui.light_button_text_insensitive_color = cozy_ui.button_text.light.insensitive_color
define mas_ui.dark_button_text_idle_color         = cozy_ui.button_text.dark.idle_color
define mas_ui.dark_button_text_hover_color        = cozy_ui.button_text.dark.hover_color
define mas_ui.dark_button_text_insensitive_color  = cozy_ui.button_text.dark.insensitive_color



################################################################################
# Option buttons
################################################################################

# Check button
init 999 style check_button_text:
    idle_color        cozy_ui.option_button_text.light.idle_color
    hover_color       cozy_ui.option_button_text.light.hover_color
    selected_color    cozy_ui.option_button_text.light.selected_color
    insensitive_color cozy_ui.option_button_text.light.insensitive_color
    outlines          []

init 999 style check_button_text_dark:
    idle_color        cozy_ui.option_button_text.dark.idle_color
    hover_color       cozy_ui.option_button_text.dark.hover_color
    selected_color    cozy_ui.option_button_text.dark.selected_color
    insensitive_color cozy_ui.option_button_text.dark.insensitive_color
    outlines          []

# Radio button
init 999 style radio_button_text:
    idle_color        cozy_ui.option_button_text.light.idle_color
    hover_color       cozy_ui.option_button_text.light.hover_color
    selected_color    cozy_ui.option_button_text.light.selected_color
    insensitive_color cozy_ui.option_button_text.light.insensitive_color
    outlines          []

init 999 style radio_button_text_dark:
    idle_color        cozy_ui.option_button_text.dark.idle_color
    hover_color       cozy_ui.option_button_text.dark.hover_color
    selected_color    cozy_ui.option_button_text.dark.selected_color
    insensitive_color cozy_ui.option_button_text.dark.insensitive_color
    outlines          []

# Fancy check button
init 999 style generic_fancy_check_button:
    ysize               36
    foreground          Transform("mod_assets/buttons/checkbox/[prefix_]fancy_check.png", yalign = 0.5)
    idle_background     Null()
    hover_background    Frame("mod_assets/buttons/checkbox/fancy_check_bg.png", Borders(CUI_BTN_SLICE(), CUI_BTN_SLICE(), CUI_BTN_SLICE(), CUI_BTN_SLICE()))
    selected_background Frame("mod_assets/buttons/checkbox/fancy_check_bg.png", Borders(CUI_BTN_SLICE(), CUI_BTN_SLICE(), CUI_BTN_SLICE(), CUI_BTN_SLICE()))

init 999 style generic_fancy_check_button_dark:
    ysize               36
    foreground          Transform("mod_assets/buttons/checkbox/[prefix_]fancy_check.png", yalign = 0.5)
    idle_background     Null()
    hover_background    Frame("mod_assets/buttons/checkbox/fancy_check_bg_d.png", Borders(5, 5, 5, 5))
    selected_background Frame("mod_assets/buttons/checkbox/fancy_check_bg_d.png", Borders(5, 5, 5, 5))

init 999 style generic_fancy_check_button_text:
    yalign         0.5
    font           gui.default_font
    color          cozy_ui.fancy_check_button_text.light.idle_color
    hover_color    cozy_ui.fancy_check_button_text.light.hover_color
    selected_color cozy_ui.fancy_check_button_text.light.selected_color

init 999 style generic_fancy_check_button_text_dark:
    yalign         0.5
    font           gui.default_font
    color          cozy_ui.fancy_check_button_text.dark.idle_color
    hover_color    cozy_ui.fancy_check_button_text.dark.hover_color
    selected_color cozy_ui.fancy_check_button_text.dark.selected_color



################################################################################
# Bars
################################################################################

# Classroom vertical scrollbar
init 999 style classroom_vscrollbar:
    base_bar Frame(cozy_ui.expand_path("%SUBMOD_DIR%/themes/active/scrollbar/vertical_bar_lt.png"))
    thumb    Frame(cozy_ui.expand_path("%SUBMOD_DIR%/themes/active/scrollbar/vertical_[prefix_]thumb_lt.png"), Borders(6, 6, 6, 6))

init 999 style classroom_vscrollbar_dark:
    base_bar Frame(cozy_ui.expand_path("%SUBMOD_DIR%/themes/active/scrollbar/vertical_bar_dk.png"))
    thumb    Frame(cozy_ui.expand_path("%SUBMOD_DIR%/themes/active/scrollbar/vertical_[prefix_]thumb_dk.png"), Borders(6, 6, 6, 6))

# Selector vertical scrollbar
# NOTE: complete definitions are needed because dark style is not defined in MAS yet
init 999 style mas_selector_sidebar_vbar:
    xsize        18
    base_bar     Frame(cozy_ui.expand_path("%SUBMOD_DIR%/themes/active/scrollbar/vertical_bar_lt.png"))
    thumb        Frame(cozy_ui.expand_path("%SUBMOD_DIR%/themes/active/scrollbar/vertical_[prefix_]thumb_lt.png"), Borders(6, 6, 6, 6))
    bar_vertical True
    bar_invert   True

init 999 style mas_selector_sidebar_vbar_dark:
    xsize        18
    base_bar     Frame(cozy_ui.expand_path("%SUBMOD_DIR%/themes/active/scrollbar/vertical_bar_dk.png"))
    thumb        Frame(cozy_ui.expand_path("%SUBMOD_DIR%/themes/active/scrollbar/vertical_[prefix_]thumb_dk.png"), Borders(6, 6, 6, 6))
    bar_vertical True
    bar_invert   True

# Generic bars/sliders (Ren'Py base styles). MAS points these at the poem/pencil
# bar; override the base with the themed straight line + themed thumb so every
# plain bar/slider matches (specific styles like the ones above set their own
# base_bar and are unaffected).
init 999 style bar:
    ysize    18
    base_bar Frame(cozy_ui.expand_path("%SUBMOD_DIR%/themes/active/scrollbar/horizontal_bar_lt.png"), Borders(4, 4, 4, 4))
    thumb    cozy_ui.expand_path("%SUBMOD_DIR%/themes/active/slider/horizontal_[prefix_]thumb_lt.png")

init 999 style bar_dark:
    ysize    18
    base_bar Frame(cozy_ui.expand_path("%SUBMOD_DIR%/themes/active/scrollbar/horizontal_bar_dk.png"), Borders(4, 4, 4, 4))
    thumb    cozy_ui.expand_path("%SUBMOD_DIR%/themes/active/slider/horizontal_[prefix_]thumb_dk.png")

init 999 style vbar:
    xsize        18
    base_bar     Frame(cozy_ui.expand_path("%SUBMOD_DIR%/themes/active/scrollbar/vertical_bar_lt.png"), Borders(4, 4, 4, 4))
    thumb        cozy_ui.expand_path("%SUBMOD_DIR%/themes/active/slider/vertical_[prefix_]thumb_lt.png")
    bar_vertical True

init 999 style vbar_dark:
    xsize        18
    base_bar     Frame(cozy_ui.expand_path("%SUBMOD_DIR%/themes/active/scrollbar/vertical_bar_dk.png"), Borders(4, 4, 4, 4))
    thumb        cozy_ui.expand_path("%SUBMOD_DIR%/themes/active/slider/vertical_[prefix_]thumb_dk.png")
    bar_vertical True

init 999 style slider:
    ysize    18
    base_bar Frame(cozy_ui.expand_path("%SUBMOD_DIR%/themes/active/scrollbar/horizontal_bar_lt.png"), Borders(4, 4, 4, 4))
    thumb    cozy_ui.expand_path("%SUBMOD_DIR%/themes/active/slider/horizontal_[prefix_]thumb_lt.png")

init 999 style slider_dark:
    ysize    18
    base_bar Frame(cozy_ui.expand_path("%SUBMOD_DIR%/themes/active/scrollbar/horizontal_bar_dk.png"), Borders(4, 4, 4, 4))
    thumb    cozy_ui.expand_path("%SUBMOD_DIR%/themes/active/slider/horizontal_[prefix_]thumb_dk.png")



################################################################################
# Game menu
################################################################################

# Title
init 999 style game_menu_label_text:
    color    cozy_ui.menu_title.light.color
    outlines cozy_ui.menu_title.light.outlines

init 999 style game_menu_label_text_dark:
    color    cozy_ui.menu_title.dark.color
    outlines cozy_ui.menu_title.dark.outlines

# Preference label
init 999 style pref_label_text:
    color    cozy_ui.menu_label.light.color
    outlines cozy_ui.menu_label.light.outlines

init 999 style pref_label_text_dark:
    color    cozy_ui.menu_label.dark.color
    outlines cozy_ui.menu_label.dark.outlines

# Version text
# NOTE: this style is also used for the tooltips at the bottom of the menu screen
init 999 style main_menu_version:
    color    cozy_ui.menu_text.light.color
    outlines cozy_ui.menu_text.light.outlines

init 999 style main_menu_version_dark:
    color    cozy_ui.menu_text.dark.color
    outlines cozy_ui.menu_text.dark.outlines

# Menu button
init 999 style navigation_button_text:
    color                cozy_ui.menu_button_text.light.color
    outlines             cozy_ui.menu_button_text.light.idle_outlines
    hover_outlines       cozy_ui.menu_button_text.light.hover_outlines
    insensitive_outlines cozy_ui.menu_button_text.light.insensitive_outlines

init 999 style navigation_button_text_dark:
    color                cozy_ui.menu_button_text.dark.color
    outlines             cozy_ui.menu_button_text.dark.idle_outlines
    hover_outlines       cozy_ui.menu_button_text.dark.hover_outlines
    insensitive_outlines cozy_ui.menu_button_text.dark.insensitive_outlines

# File menu
init 999 style page_label_text:
    color    cozy_ui.menu_text.light.color
    outlines cozy_ui.menu_text.light.outlines

init 999 style page_label_text_dark:
    color    cozy_ui.menu_text.dark.color
    outlines cozy_ui.menu_text.dark.outlines

init 999 style slot_button:
    background "gui/button/slot_[prefix_]background.png"

init 999 style slot_button_dark:
    background "gui/button/slot_[prefix_]background_d.png"

init 999 style slot_button_text:
    idle_color        cozy_ui.button_text.light.idle_color
    hover_color       cozy_ui.button_text.light.hover_color
    selected_color    cozy_ui.button_text.light.selected_color
    insensitive_color cozy_ui.button_text.light.insensitive_color
    outlines          cozy_ui.button_text.light.outlines

init 999 style slot_button_text_dark:
    idle_color        cozy_ui.button_text.dark.idle_color
    hover_color       cozy_ui.button_text.dark.hover_color
    selected_color    cozy_ui.button_text.dark.selected_color
    insensitive_color cozy_ui.button_text.dark.insensitive_color
    outlines          cozy_ui.button_text.dark.outlines

init 999 style slot_time_text is slot_button_text
init 999 style slot_time_text_dark is slot_button_text_dark
init 999 style slot_name_text is slot_button_text
init 999 style slot_name_text_dark is slot_button_text_dark

init 999 style page_button_text:
    idle_color        cozy_ui.button_text.light.idle_color
    hover_color       cozy_ui.button_text.light.hover_color
    selected_color    cozy_ui.button_text.light.selected_color
    insensitive_color cozy_ui.button_text.light.insensitive_color
    outlines          cozy_ui.button_text.light.outlines

init 999 style page_button_text_dark:
    idle_color        cozy_ui.button_text.dark.idle_color
    hover_color       cozy_ui.button_text.dark.hover_color
    selected_color    cozy_ui.button_text.dark.selected_color
    insensitive_color cozy_ui.button_text.dark.insensitive_color
    outlines          cozy_ui.button_text.dark.outlines



################################################################################
# Music menu
################################################################################

# Music menu button
init 999 style music_menu_button_text:
    color                cozy_ui.music_menu_button_text.light.color
    outlines             cozy_ui.music_menu_button_text.light.idle_outlines
    hover_outlines       cozy_ui.music_menu_button_text.light.hover_outlines
    insensitive_outlines cozy_ui.music_menu_button_text.light.insensitive_outlines

init 999 style music_menu_button_text_dark:
    color                cozy_ui.music_menu_button_text.dark.color
    outlines             cozy_ui.music_menu_button_text.dark.idle_outlines
    hover_outlines       cozy_ui.music_menu_button_text.dark.hover_outlines
    insensitive_outlines cozy_ui.music_menu_button_text.dark.insensitive_outlines



################################################################################
# Dialogue
################################################################################

# Name
init 999 style say_label:
    color    cozy_ui.menu_label.light.color
    outlines cozy_ui.menu_label.light.outlines

init 999 style say_label_dark:
    color    cozy_ui.menu_label.dark.color
    outlines cozy_ui.menu_label.dark.outlines

# Text
init 999 style normal:
    color    cozy_ui.dialogue_text.color
    outlines cozy_ui.dialogue_text.outlines

# Quick button
init 999 style quick_button_text:
    idle_color        cozy_ui.quick_button_text.light.idle_color
    hover_color       cozy_ui.quick_button_text.light.hover_color
    selected_color    cozy_ui.quick_button_text.light.selected_color
    insensitive_color cozy_ui.quick_button_text.light.insensitive_color
    outlines          cozy_ui.quick_button_text.light.outlines

init 999 style quick_button_text_dark:
    idle_color        cozy_ui.quick_button_text.dark.idle_color
    hover_color       cozy_ui.quick_button_text.dark.hover_color
    selected_color    cozy_ui.quick_button_text.dark.selected_color
    insensitive_color cozy_ui.quick_button_text.dark.insensitive_color
    outlines          cozy_ui.quick_button_text.dark.outlines



################################################################################
# History
################################################################################

# Name
init 999 style history_name_text:
    color    cozy_ui.history_name.color
    outlines cozy_ui.history_name.outlines

# Text
init 999 style history_text:
    color    cozy_ui.history_text.color
    outlines cozy_ui.history_text.outlines



################################################################################
# Frames
################################################################################

# Frame
define gui.frame_borders = Borders(5, 5, 5, 5, -1, -1, -1, -1)

# Confirm frame
define gui.confirm_frame_borders = Borders(40, 40, 40, 40)

init 999 style confirm_prompt_text:
    color    cozy_ui.confirm_prompt_text.light.color
    outlines cozy_ui.confirm_prompt_text.light.outlines

init 999 style confirm_prompt_text_dark:
    color    cozy_ui.confirm_prompt_text.dark.color
    outlines cozy_ui.confirm_prompt_text.dark.outlines



################################################################################
# Choice menu
################################################################################
init 999 style choice_button:
    xpadding   25
    background Frame(cozy_ui.expand_path("%SUBMOD_DIR%/themes/active/button/[prefix_]bg_lt.png"), Borders(CUI_BTN_SLICE(), CUI_BTN_SLICE(), CUI_BTN_SLICE(), CUI_BTN_SLICE()))

init 999 style choice_button_dark:
    xpadding   25
    background Frame(cozy_ui.expand_path("%SUBMOD_DIR%/themes/active/button/[prefix_]bg_dk.png"), Borders(CUI_BTN_SLICE(), CUI_BTN_SLICE(), CUI_BTN_SLICE(), CUI_BTN_SLICE()))

init 999 style choice_button_text:
    idle_color        cozy_ui.button_text.light.idle_color
    hover_color       cozy_ui.button_text.light.hover_color
    selected_color    cozy_ui.button_text.light.selected_color
    insensitive_color cozy_ui.button_text.light.insensitive_color
    outlines          cozy_ui.button_text.light.outlines

init 999 style choice_button_text_dark:
    idle_color        cozy_ui.button_text.dark.idle_color
    hover_color       cozy_ui.button_text.dark.hover_color
    selected_color    cozy_ui.button_text.dark.selected_color
    insensitive_color cozy_ui.button_text.dark.insensitive_color
    outlines          cozy_ui.button_text.dark.outlines



################################################################################
# Scrollable menu
################################################################################
init 999 style scrollable_menu_button:
    background Frame(cozy_ui.expand_path("%SUBMOD_DIR%/themes/active/button/[prefix_]bg_lt.png"), Borders(CUI_BTN_SLICE(), CUI_BTN_SLICE(), CUI_BTN_SLICE(), CUI_BTN_SLICE()))

init 999 style scrollable_menu_button_dark:
    background Frame(cozy_ui.expand_path("%SUBMOD_DIR%/themes/active/button/[prefix_]bg_dk.png"), Borders(CUI_BTN_SLICE(), CUI_BTN_SLICE(), CUI_BTN_SLICE(), CUI_BTN_SLICE()))

init 999 style scrollable_menu_button_text:
    idle_color        cozy_ui.button_text.light.idle_color
    hover_color       cozy_ui.button_text.light.hover_color
    selected_color    cozy_ui.button_text.light.selected_color
    insensitive_color cozy_ui.button_text.light.insensitive_color
    outlines          cozy_ui.button_text.light.outlines

init 999 style scrollable_menu_button_text_dark:
    idle_color        cozy_ui.button_text.dark.idle_color
    hover_color       cozy_ui.button_text.dark.hover_color
    selected_color    cozy_ui.button_text.dark.selected_color
    insensitive_color cozy_ui.button_text.dark.insensitive_color
    outlines          cozy_ui.button_text.dark.outlines



################################################################################
# Two-pane scrollable menu
################################################################################
init 999 style twopane_scrollable_menu_button:
    background Frame(cozy_ui.expand_path("%SUBMOD_DIR%/themes/active/button/[prefix_]bg_lt.png"), Borders(CUI_BTN_SLICE(), CUI_BTN_SLICE(), CUI_BTN_SLICE(), CUI_BTN_SLICE()))

init 999 style twopane_scrollable_menu_button_dark:
    background Frame(cozy_ui.expand_path("%SUBMOD_DIR%/themes/active/button/[prefix_]bg_dk.png"), Borders(CUI_BTN_SLICE(), CUI_BTN_SLICE(), CUI_BTN_SLICE(), CUI_BTN_SLICE()))

init 999 style twopane_scrollable_menu_button_text:
    idle_color        cozy_ui.button_text.light.idle_color
    hover_color       cozy_ui.button_text.light.hover_color
    selected_color    cozy_ui.button_text.light.selected_color
    insensitive_color cozy_ui.button_text.light.insensitive_color
    outlines          cozy_ui.button_text.light.outlines

init 999 style twopane_scrollable_menu_button_text_dark:
    idle_color        cozy_ui.button_text.dark.idle_color
    hover_color       cozy_ui.button_text.dark.hover_color
    selected_color    cozy_ui.button_text.dark.selected_color
    insensitive_color cozy_ui.button_text.dark.insensitive_color
    outlines          cozy_ui.button_text.dark.outlines



################################################################################
# Talk choice menu
################################################################################
init 999 style talk_choice_button:
    background Frame(cozy_ui.expand_path("%SUBMOD_DIR%/themes/active/button/[prefix_]bg_lt.png"), Borders(CUI_BTN_SLICE(), CUI_BTN_SLICE(), CUI_BTN_SLICE(), CUI_BTN_SLICE()))

init 999 style talk_choice_button_dark:
    background Frame(cozy_ui.expand_path("%SUBMOD_DIR%/themes/active/button/[prefix_]bg_dk.png"), Borders(CUI_BTN_SLICE(), CUI_BTN_SLICE(), CUI_BTN_SLICE(), CUI_BTN_SLICE()))

init 999 style talk_choice_button_text:
    idle_color        cozy_ui.button_text.light.idle_color
    hover_color       cozy_ui.button_text.light.hover_color
    selected_color    cozy_ui.button_text.light.selected_color
    insensitive_color cozy_ui.button_text.light.insensitive_color
    outlines          cozy_ui.button_text.light.outlines

init 999 style talk_choice_button_text_dark:
    idle_color        cozy_ui.button_text.dark.idle_color
    hover_color       cozy_ui.button_text.dark.hover_color
    selected_color    cozy_ui.button_text.dark.selected_color
    insensitive_color cozy_ui.button_text.dark.insensitive_color
    outlines          cozy_ui.button_text.dark.outlines



################################################################################
# Hotkey button menu
################################################################################
init 999 style hkb_button:
    background Frame(cozy_ui.expand_path("%SUBMOD_DIR%/themes/active/button/[prefix_]bg_lt.png"), Borders(CUI_BTN_SLICE(), CUI_BTN_SLICE(), CUI_BTN_SLICE(), CUI_BTN_SLICE()))

init 999 style hkb_button_dark:
    background Frame(cozy_ui.expand_path("%SUBMOD_DIR%/themes/active/button/[prefix_]bg_dk.png"), Borders(CUI_BTN_SLICE(), CUI_BTN_SLICE(), CUI_BTN_SLICE(), CUI_BTN_SLICE()))

init 999 style hkb_button_text:
    align             (0.5, 0.5)
    text_align        0.5
    idle_color        cozy_ui.button_text.light.idle_color
    hover_color       cozy_ui.button_text.light.hover_color
    selected_color    cozy_ui.button_text.light.selected_color
    insensitive_color cozy_ui.button_text.light.insensitive_color
    outlines          cozy_ui.button_text.light.outlines

init 999 style hkb_button_text_dark:
    align             (0.5, 0.5)
    text_align        0.5
    idle_color        cozy_ui.button_text.dark.idle_color
    hover_color       cozy_ui.button_text.dark.hover_color
    selected_color    cozy_ui.button_text.dark.selected_color
    insensitive_color cozy_ui.button_text.dark.insensitive_color
    outlines          cozy_ui.button_text.dark.outlines



################################################################################
# Island buttons
################################################################################
init 999 style island_button:
    background Frame(cozy_ui.expand_path("%SUBMOD_DIR%/themes/active/button/[prefix_]bg_lt.png"), Borders(CUI_BTN_SLICE(), CUI_BTN_SLICE(), CUI_BTN_SLICE(), CUI_BTN_SLICE()))

init 999 style island_button_dark:
    background Frame(cozy_ui.expand_path("%SUBMOD_DIR%/themes/active/button/[prefix_]bg_dk.png"), Borders(CUI_BTN_SLICE(), CUI_BTN_SLICE(), CUI_BTN_SLICE(), CUI_BTN_SLICE()))

init 999 style island_button_text:
    align             (0.5, 0.5)
    text_align        0.5
    idle_color        cozy_ui.button_text.light.idle_color
    hover_color       cozy_ui.button_text.light.hover_color
    selected_color    cozy_ui.button_text.light.selected_color
    insensitive_color cozy_ui.button_text.light.insensitive_color
    outlines          cozy_ui.button_text.light.outlines

init 999 style island_button_text_dark:
    align             (0.5, 0.5)
    text_align        0.5
    idle_color        cozy_ui.button_text.dark.idle_color
    hover_color       cozy_ui.button_text.dark.hover_color
    selected_color    cozy_ui.button_text.dark.selected_color
    insensitive_color cozy_ui.button_text.dark.insensitive_color
    outlines          cozy_ui.button_text.dark.outlines



################################################################################
# Extras menu
################################################################################
init 999 style mas_extra_menu_frame:
    background Frame("mod_assets/frames/trans_pink2pxborder100.png", Borders(5, 5, 5, 5, pad_top = 2, pad_bottom = 4))

init 999 style mas_extra_menu_frame_dark:
    background Frame("mod_assets/frames/trans_pink2pxborder100_d.png", Borders(5, 5, 5, 5, pad_top = 2, pad_bottom = 4))

init 999 style mas_extra_menu_label_text:
    color "#f8f8f8"

init 999 style mas_extra_menu_label_text_dark:
    color cozy_ui.button_text.dark.idle_color

# NOTE: complete definitions are needed because dark style is not defined in MAS yet
init 999 style mas_adjust_vbar:
    xsize        18
    base_bar     Frame(cozy_ui.expand_path("%SUBMOD_DIR%/themes/active/scrollbar/vertical_bar_lt.png"), Borders(4, 4, 4, 4))
    thumb        cozy_ui.expand_path("%SUBMOD_DIR%/themes/active/slider/vertical_[prefix_]thumb_lt.png")
    bar_vertical True

init 999 style mas_adjust_vbar_dark:
    xsize        18
    base_bar     Frame(cozy_ui.expand_path("%SUBMOD_DIR%/themes/active/scrollbar/vertical_bar_dk.png"), Borders(4, 4, 4, 4))
    thumb        cozy_ui.expand_path("%SUBMOD_DIR%/themes/active/slider/vertical_[prefix_]thumb_dk.png")
    bar_vertical True

init 999 style mas_adjustable_button:
    background Frame(cozy_ui.expand_path("%SUBMOD_DIR%/themes/active/button/[prefix_]bg_lt.png"), Borders(CUI_BTN_SLICE(), CUI_BTN_SLICE(), CUI_BTN_SLICE(), CUI_BTN_SLICE()))

init 999 style mas_adjustable_button_dark:
    background Frame(cozy_ui.expand_path("%SUBMOD_DIR%/themes/active/button/[prefix_]bg_dk.png"), Borders(CUI_BTN_SLICE(), CUI_BTN_SLICE(), CUI_BTN_SLICE(), CUI_BTN_SLICE()))

init 999 style mas_adjustable_button_text:
    align             (0.5, 0.5)
    text_align        0.5
    idle_color        cozy_ui.button_text.light.idle_color
    hover_color       cozy_ui.button_text.light.hover_color
    selected_color    cozy_ui.button_text.light.selected_color
    insensitive_color cozy_ui.button_text.light.insensitive_color
    outlines          cozy_ui.button_text.light.outlines

init 999 style mas_adjustable_button_text_dark:
    align             (0.5, 0.5)
    text_align        0.5
    idle_color        cozy_ui.button_text.dark.idle_color
    hover_color       cozy_ui.button_text.dark.hover_color
    selected_color    cozy_ui.button_text.dark.selected_color
    insensitive_color cozy_ui.button_text.dark.insensitive_color
    outlines          cozy_ui.button_text.dark.outlines



################################################################################
# Input caret
################################################################################
init 999 image input_caret:
    Solid(cozy_ui.input_caret_color)
    size (2, 25)
    subpixel True
    block:
        linear 0.35 alpha 0
        linear 0.35 alpha 1
        repeat



################################################################################
# Generic buttons (hotkey buttons)
################################################################################
# MAS defines generic_button with a fixed Borders(5, 5, 5, 5), which distorts
# the corners once the rounding exceeds the slice. Re-declare the background so
# the slice tracks the rounding (CUI_BTN_SLICE), giving clean rounded corners.
init 999 style generic_button_light:
    background Frame("mod_assets/buttons/generic/[prefix_]bg.png", Borders(CUI_BTN_SLICE(), CUI_BTN_SLICE(), CUI_BTN_SLICE(), CUI_BTN_SLICE()), tile=False)

init 999 style generic_button_dark:
    background Frame("mod_assets/buttons/generic/[prefix_]bg_d.png", Borders(CUI_BTN_SLICE(), CUI_BTN_SLICE(), CUI_BTN_SLICE(), CUI_BTN_SLICE()), tile=False)
