################################################################################
#
# Copyright (c) 2026 Friends of Monika
#
# See LICENSE file for the licensing information
#
################################################################################

init -990 python:
    store.mas_submod_utils.Submod(
        author="Friends of Monika",
        coauthors=["Dominus Iniquitatis"],
        name="CozyUI",
        description=_("Smooth and customizable UI add-on, overhauled."),
        version="3.0.1",
        settings_pane="cozy_ui_settings_pane"
    )

init -989 python:
    if store.mas_submod_utils.isSubmodInstalled("Submod Updater Plugin"):
        store.sup_utils.SubmodUpdater(
            submod="CozyUI",
            user_name="friends-of-monika",
            repository_name="mas-cozyui",
            extraction_depth=2
        )
