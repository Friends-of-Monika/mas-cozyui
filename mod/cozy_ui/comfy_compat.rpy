################################################################################
#
# Copyright (c) 2026 Friends of Monika
#
# See LICENSE file for the licensing information
#
################################################################################

# Backward compatibility with the original Comfy UI submod: other submods may
# reference the comfy_ui store (most notably comfy_ui.theme_mgr). Redirect the
# old names to the cozy_ui store, but only when the original submod is not
# installed alongside - never clobber the real thing.

init 989 python in comfy_ui:
    import store

    _original_installed = store.mas_submod_utils.isSubmodInstalled("Comfy UI")

    if not _original_installed:
        from store import cozy_ui as _cozy_ui

        theme_mgr = _cozy_ui.theme_mgr

init 999 python in comfy_ui:
    # Mirror the remaining public attributes of the cozy_ui store (theme
    # defines like comfy_ui.common.*, path helpers etc.) under the old store
    # name, unless something already redefined them here.
    if not _original_installed:
        _cozy_store = renpy.python.store_dicts["store.cozy_ui"]
        _self_store = renpy.python.store_dicts["store.comfy_ui"]

        for _name in _cozy_store.keys():
            if not _name.startswith("_") and _name not in _self_store:
                _self_store[_name] = _cozy_store[_name]
