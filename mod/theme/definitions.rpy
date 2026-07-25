################################################################################
#
# Copyright (c) 2020-2021 Dominus Iniquitatis <zerosaiko@gmail.com>
# Copyright (c) 2026 Friends of Monika
#
# See LICENSE file for the licensing information
#
################################################################################
define cozy_ui.common.font_regular     = cozy_ui.expand_path("CUI_MAIN_FONT_REGULAR()")
define cozy_ui.common.font_italic      = cozy_ui.expand_path("CUI_MAIN_FONT_ITALIC()")
define cozy_ui.common.font_bold        = cozy_ui.expand_path("CUI_MAIN_FONT_BOLD()")
define cozy_ui.common.font_bold_italic = cozy_ui.expand_path("CUI_MAIN_FONT_BOLD_ITALIC()")
define cozy_ui.common.font             = FontGroup().add(
    cozy_ui.common.font_regular                 , 0x0020, 0x00ff).add( # Main
    "mod_assets/font/SourceHanSansK-Regular.otf" , 0xac00, 0xd7a3).add( # Korean
    "mod_assets/font/SourceHanSansSC-Regular.otf", 0x4e00, 0x9faf).add( # Simplified chinese
    "mod_assets/font/mplus-2p-regular.ttf"       , 0x3000, 0x4dff).add( # Japanese and others
    "gui/font/Aller_Rg.ttf"                      , 0x0000, 0xffff)      # Fallback
define cozy_ui.common.font_kerning     = CUI_MAIN_FONT_KERNING()
define cozy_ui.common.font_size        = 24

define cozy_ui.menu_font         = cozy_ui.expand_path("CUI_MENU_FONT()")
define cozy_ui.menu_font_kerning = 0.0

define cozy_ui.menu_title.font_size      = 38
define cozy_ui.menu_title.light.color    = "CUI_SCD_COLOR(255, 255, 255)"
define cozy_ui.menu_title.light.outlines = [(6, "CUI_SCD_COLOR(187, 85, 153)", 0, 0), (3, "CUI_SCD_COLOR(187, 85, 153)", 2, 2)]
define cozy_ui.menu_title.dark.color     = "CUI_SCD_COLOR(250, 235, 241)"
define cozy_ui.menu_title.dark.outlines  = [(6, "CUI_SCD_COLOR(126, 53, 104)", 0, 0), (3, "CUI_SCD_COLOR(126, 53, 104)", 2, 2)]

define cozy_ui.menu_label.font_size      = 24
define cozy_ui.menu_label.light.color    = "CUI_SCD_COLOR(255, 255, 255)"
define cozy_ui.menu_label.light.outlines = [(3, "CUI_SCD_COLOR(187, 85, 153)", 0, 0), (1, "CUI_SCD_COLOR(187, 85, 153)", 1, 1)]
define cozy_ui.menu_label.dark.color     = "CUI_SCD_COLOR(250, 235, 241)"
define cozy_ui.menu_label.dark.outlines  = [(3, "CUI_SCD_COLOR(126, 53, 104)", 0, 0), (1, "CUI_SCD_COLOR(126, 53, 104)", 1, 1)]

define cozy_ui.menu_text.font_size      = 16
define cozy_ui.menu_text.light.color    = "CUI_SCD_COLOR(56, 56, 56)"
define cozy_ui.menu_text.light.outlines = []
define cozy_ui.menu_text.dark.color     = "CUI_SCD_COLOR(245, 163, 199)"
define cozy_ui.menu_text.dark.outlines  = []

define cozy_ui.menu_button_text.font_size                  = 24
define cozy_ui.menu_button_text.light.color                = "CUI_SCD_COLOR(255, 255, 255)"
define cozy_ui.menu_button_text.light.idle_outlines        = [(4, "CUI_SCD_COLOR(187, 85, 153)", 0, 0), (2, "CUI_SCD_COLOR(187, 85, 153)", 2, 2)]
define cozy_ui.menu_button_text.light.hover_outlines       = [(4, "CUI_SCD_COLOR(255, 170, 204)", 0, 0), (2, "CUI_SCD_COLOR(255, 170, 204)", 2, 2)]
define cozy_ui.menu_button_text.light.insensitive_outlines = [(4, "CUI_SCD_COLOR(255, 204, 238)", 0, 0), (2, "CUI_SCD_COLOR(255, 204, 238)", 2, 2)]
define cozy_ui.menu_button_text.dark.color                 = "CUI_SCD_COLOR(250, 235, 241)"
define cozy_ui.menu_button_text.dark.idle_outlines         = [(4, "CUI_SCD_COLOR(126, 53, 104)", 0, 0), (2, "CUI_SCD_COLOR(126, 53, 104)", 2, 2)]
define cozy_ui.menu_button_text.dark.hover_outlines        = [(4, "CUI_SCD_COLOR(201, 105, 172)", 0, 0), (2, "CUI_SCD_COLOR(201, 105, 172)", 2, 2)]
define cozy_ui.menu_button_text.dark.insensitive_outlines  = [(4, "CUI_SCD_COLOR(186, 120, 166)", 0, 0), (2, "CUI_SCD_COLOR(186, 120, 166)", 2, 2)]

# The song list can carry arbitrary Unicode (custom BGM titles), so the chosen
# font only owns the Latin range; CJK and the rest fall back the same way
# cozy_ui.common.font does, with mplus-2p as the wide-glyph fallback.
define cozy_ui.music_menu_button_text.font                       = FontGroup().add(
    cozy_ui.expand_path("CUI_MUSIC_FONT()")      , 0x0020, 0x00ff).add( # Chosen font (Latin)
    "mod_assets/font/SourceHanSansK-Regular.otf" , 0xac00, 0xd7a3).add( # Korean
    "mod_assets/font/SourceHanSansSC-Regular.otf", 0x4e00, 0x9faf).add( # Simplified chinese
    "mod_assets/font/mplus-2p-regular.ttf"       , 0x3000, 0x4dff).add( # Japanese and others
    "gui/font/Aller_Rg.ttf"                      , 0x0000, 0xffff)      # Fallback
define cozy_ui.music_menu_button_text.font_kerning               = 0.0
define cozy_ui.music_menu_button_text.font_size                  = 24
define cozy_ui.music_menu_button_text.light.color                = "CUI_SCD_COLOR(255, 255, 255)"
define cozy_ui.music_menu_button_text.light.idle_outlines        = [(3, "CUI_SCD_COLOR(187, 85, 153)", 0, 0), (1, "CUI_SCD_COLOR(187, 85, 153)", 1, 1)]
define cozy_ui.music_menu_button_text.light.hover_outlines       = [(3, "CUI_SCD_COLOR(255, 170, 204)", 0, 0), (1, "CUI_SCD_COLOR(255, 170, 204)", 1, 1)]
define cozy_ui.music_menu_button_text.light.insensitive_outlines = [(3, "CUI_SCD_COLOR(255, 204, 238)", 0, 0), (1, "CUI_SCD_COLOR(255, 204, 238)", 1, 1)]
define cozy_ui.music_menu_button_text.dark.color                 = "CUI_SCD_COLOR(250, 235, 241)"
define cozy_ui.music_menu_button_text.dark.idle_outlines         = [(3, "CUI_SCD_COLOR(126, 53, 104)", 0, 0), (1, "CUI_SCD_COLOR(126, 53, 104)", 1, 1)]
define cozy_ui.music_menu_button_text.dark.hover_outlines        = [(3, "CUI_SCD_COLOR(201, 105, 172)", 0, 0), (1, "CUI_SCD_COLOR(201, 105, 172)", 1, 1)]
define cozy_ui.music_menu_button_text.dark.insensitive_outlines  = [(3, "CUI_SCD_COLOR(186, 120, 166)", 0, 0), (1, "CUI_SCD_COLOR(186, 120, 166)", 1, 1)]

define cozy_ui.confirm_prompt_text.light.color    = "CUI_PRM_COLOR(56, 56, 56)"
define cozy_ui.confirm_prompt_text.light.outlines = []
define cozy_ui.confirm_prompt_text.dark.color     = "CUI_PRM_COLOR(245, 163, 199)"
define cozy_ui.confirm_prompt_text.dark.outlines  = []

define cozy_ui.dialogue_text.vertical_offset = CUI_DLG_VERT_OFFSET()
define cozy_ui.dialogue_text.line_spacing    = CUI_DLG_LINE_SPACING()
define cozy_ui.dialogue_text.color           = "CUI_DLG_TEXT_COLOR(248, 248, 248)"
define cozy_ui.dialogue_text.outlines        = [(2, "CUI_DLG_TEXT_COLOR(26, 26, 26)", 0, 0)]

define cozy_ui.history_name.color    = "CUI_DLG_TEXT_COLOR(248, 248, 248)"
define cozy_ui.history_name.outlines = [(2, "CUI_DLG_TEXT_COLOR(26, 26, 26)", 0, 0)]

define cozy_ui.history_text.color    = "CUI_DLG_TEXT_COLOR(255, 255, 255)"
define cozy_ui.history_text.outlines = [(2, "CUI_DLG_TEXT_COLOR(26, 26, 26)", 0, 0)]

define cozy_ui.quick_button_text.font_size               = 14
define cozy_ui.quick_button_text.light.idle_color        = "CUI_SCD_COLOR(85, 34, 34)"
define cozy_ui.quick_button_text.light.hover_color       = "CUI_SCD_COLOR(255, 204, 204)"
define cozy_ui.quick_button_text.light.selected_color    = "CUI_SCD_COLOR(255, 255, 255)"
define cozy_ui.quick_button_text.light.insensitive_color = "CUI_SCD_COLOR(170, 102, 102)"
define cozy_ui.quick_button_text.light.outlines          = []
define cozy_ui.quick_button_text.dark.idle_color         = "CUI_SCD_COLOR(235, 173, 185)"
define cozy_ui.quick_button_text.dark.hover_color        = "CUI_SCD_COLOR(252, 232, 236)"
define cozy_ui.quick_button_text.dark.selected_color     = "CUI_SCD_COLOR(255, 238, 235)"
define cozy_ui.quick_button_text.dark.insensitive_color  = "CUI_SCD_COLOR(170, 102, 102)"
define cozy_ui.quick_button_text.dark.outlines           = []

define cozy_ui.button.height_adjustment = CUI_BTN_HEIGHT_ADJUSTMENT()

define cozy_ui.button_text.vertical_offset         = CUI_BTN_TEXT_VERT_OFFSET()
define cozy_ui.button_text.light.idle_color        = "CUI_BTN_TEXT_COLOR(56, 56, 56)"
define cozy_ui.button_text.light.hover_color       = "CUI_BTN_TEXT_COLOR(255, 170, 153)"
define cozy_ui.button_text.light.selected_color    = "CUI_BTN_TEXT_COLOR(187, 85, 136)"
define cozy_ui.button_text.light.insensitive_color = "CUI_BTN_TEXT_COLOR(170, 170, 170, 127)"
define cozy_ui.button_text.light.outlines          = []
define cozy_ui.button_text.dark.idle_color         = "CUI_BTN_TEXT_COLOR(245, 163, 199)"
define cozy_ui.button_text.dark.hover_color        = "CUI_BTN_TEXT_COLOR(255, 189, 200)"
define cozy_ui.button_text.dark.selected_color     = "CUI_BTN_TEXT_COLOR(187, 85, 136)"
define cozy_ui.button_text.dark.insensitive_color  = "CUI_BTN_TEXT_COLOR(115, 115, 115, 127)"
define cozy_ui.button_text.dark.outlines           = []

# The option (settings check/radio) labels can be localized, so the chosen font
# only owns the Latin range; CJK and the rest fall back like cozy_ui.common.font.
define cozy_ui.option_button_text.font                    = FontGroup().add(
    cozy_ui.expand_path("CUI_OPTION_FONT()")     , 0x0020, 0x00ff).add( # Chosen font (Latin)
    "mod_assets/font/SourceHanSansK-Regular.otf" , 0xac00, 0xd7a3).add( # Korean
    "mod_assets/font/SourceHanSansSC-Regular.otf", 0x4e00, 0x9faf).add( # Simplified chinese
    "mod_assets/font/mplus-2p-regular.ttf"       , 0x3000, 0x4dff).add( # Japanese and others
    "gui/font/Aller_Rg.ttf"                      , 0x0000, 0xffff)      # Fallback
define cozy_ui.option_button_text.font_kerning            = 0.0
define cozy_ui.option_button_text.font_size               = 24
define cozy_ui.option_button_text.light.idle_color        = "CUI_SCD_COLOR(170, 170, 170)"
define cozy_ui.option_button_text.light.hover_color       = "CUI_SCD_COLOR(204, 102, 153)"
define cozy_ui.option_button_text.light.selected_color    = "CUI_SCD_COLOR(187, 85, 136)"
define cozy_ui.option_button_text.light.insensitive_color = "CUI_SCD_COLOR(170, 170, 170, 127)"
define cozy_ui.option_button_text.dark.idle_color         = "CUI_SCD_COLOR(115, 115, 115)"
define cozy_ui.option_button_text.dark.hover_color        = "CUI_SCD_COLOR(230, 153, 186)"
define cozy_ui.option_button_text.dark.selected_color     = "CUI_SCD_COLOR(209, 123, 157)"
define cozy_ui.option_button_text.dark.insensitive_color  = "CUI_SCD_COLOR(115, 115, 115, 127)"

define cozy_ui.fancy_check_button_text.light.idle_color     = "CUI_PRM_COLOR(191, 191, 191)"
define cozy_ui.fancy_check_button_text.light.hover_color    = "CUI_PRM_COLOR(56, 56, 56)"
define cozy_ui.fancy_check_button_text.light.selected_color = "CUI_PRM_COLOR(56, 56, 56)"
define cozy_ui.fancy_check_button_text.dark.idle_color      = "CUI_PRM_COLOR(191, 191, 191)"
define cozy_ui.fancy_check_button_text.dark.hover_color     = "CUI_PRM_COLOR(56, 56, 56)"
define cozy_ui.fancy_check_button_text.dark.selected_color  = "CUI_PRM_COLOR(56, 56, 56)"

define cozy_ui.scrollable_menu_button_spacing = 6
define cozy_ui.choice_button_spacing          = 12
define cozy_ui.talk_button_spacing            = 16
define cozy_ui.hotkey_button_spacing          = 5

define cozy_ui.input_caret_color = "CUI_SCD_COLOR(187, 85, 153)"
