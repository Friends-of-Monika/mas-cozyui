################################################################################
#
# Copyright (c) 2020-2021 Dominus Iniquitatis <zerosaiko@gmail.com>
# Copyright (c) 2026 Friends of Monika
#
# See LICENSE file for the licensing information
#
################################################################################
screen cozy_ui_pref_labels:
    hbox:
        label _("Sunrise: ")
        label _(sr_display)

    hbox:
        label _("Sunset: ")
        label _(ss_display)

    hbox:
        label _("Random Chatter: ")
        label _(rc_display)

init 999 python:
    screens = renpy.display.screen.screens
    screens[("preferences", None)].ast.children[2].block.children[0].children[2].children[1].children[0] = screens[("cozy_ui_pref_labels", None)].ast.children[0]
    screens[("preferences", None)].ast.children[2].block.children[0].children[2].children[1].children[2] = screens[("cozy_ui_pref_labels", None)].ast.children[1]
    screens[("preferences", None)].ast.children[2].block.children[0].children[2].children[2].children[0] = screens[("cozy_ui_pref_labels", None)].ast.children[2]
