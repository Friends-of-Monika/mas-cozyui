################################################################################
#
# Copyright (c) 2020-2021 Dominus Iniquitatis <zerosaiko@gmail.com>
# Copyright (c) 2026 Friends of Monika
#
# See LICENSE file for the licensing information
#
################################################################################

default persistent.cozy_ui_show_preview = False

label cozy_ui_apply:
    $ persistent.closed_self = True
    $ cozy_ui.theme_mgr.install()
    $ cozy_ui.theme_mgr.save_settings()
    $ renpy.quit()

label cozy_ui_disable:
    $ persistent.closed_self = True
    $ cozy_ui.theme_mgr.disable()
    $ cozy_ui.theme_mgr.save_settings()
    $ renpy.quit()

label cozy_ui_glitch:
    show screen tear(20, 0.1, 0.1, 0, 40)
    play sound "sfx/s_kill_glitch1.ogg"
    $ pause(0.25)
    hide screen tear
    stop sound

screen cozy_ui_settings_pane():
    $ theme_count = cozy_ui.theme_mgr.get_theme_count()

    vbox:
        xfill True
        ypos 10

        if theme_count > 0:
            $ theme_name = cozy_ui.theme_mgr.get_current_theme_name()
            $ theme_preview = cozy_ui.theme_mgr.get_current_theme_preview()

            hbox:
                vbox:
                    xmaximum 350

                    hbox:
                        xfill True

                        text _("Theme: [theme_name]"):
                            style "slider_label"

                        textbutton _("Preview"):
                            style "check_button"
                            xalign 1.0
                            ypos 15
                            action ToggleField(persistent, "cozy_ui_show_preview")

                    bar:
                        style "slider_slider"
                        value DictValue(
                            cozy_ui.theme_mgr.settings,
                            "selected_theme_index",
                            range = theme_count - 1
                        )

                    grid 3 1:
                        xfill True

                        textbutton _("Fonts"):
                            style "check_button"
                            action ToggleDict(cozy_ui.theme_mgr.settings, "use_fonts")

                        textbutton _("Layout"):
                            style "check_button"
                            action ToggleDict(cozy_ui.theme_mgr.settings, "use_layout")

                        textbutton _("HiDPI"):
                            style "check_button"
                            # Reflect the variant actually used; only toggleable
                            # when the theme ships both base and HiDPI variants.
                            selected cozy_ui.theme_mgr.use_hidpi_effective()
                            sensitive cozy_ui.theme_mgr.current_has_base() and cozy_ui.theme_mgr.current_has_hidpi()
                            action ToggleDict(cozy_ui.theme_mgr.settings, "use_hidpi")

                    null height 10

                    hbox:
                        $ glitch_chance = 1.0 / 400.0
                        $ glitch_action = Jump("cozy_ui_glitch")

                        $ apply_glitched = renpy.random.random() < glitch_chance
                        $ apply_name = _("Apply") if not apply_glitched else glitchtext(10)
                        $ apply_width = 100 if not apply_glitched else 150
                        $ apply_action = Show(screen = "dialog", message = _("Please restart the game."), ok_action = Jump("cozy_ui_apply"))

                        $ disable_glitched = renpy.random.random() < glitch_chance
                        $ disable_name = _("Disable") if not disable_glitched else glitchtext(10)
                        $ disable_width = 100 if not disable_glitched else 150
                        $ disable_action = Show(screen = "dialog", message = _("Please restart the game."), ok_action = Jump("cozy_ui_disable"))

                        textbutton apply_name:
                            style "navigation_button"
                            xsize apply_width
                            action If(apply_glitched, glitch_action, apply_action)

                        textbutton disable_name:
                            style "navigation_button"
                            xsize disable_width
                            action If(disable_glitched, glitch_action, disable_action)

                if persistent.cozy_ui_show_preview:
                    add theme_preview:
                        xpos 10
                        ypos 20

        else:
            label _("No themes available.")

init python:
    import random

    nonunicode = "¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽž"

    def glitchtext(length):
        output = ""
        for x in range(length):
            output += random.choice(nonunicode)
        return output
