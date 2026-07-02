################################################################################
#
# Copyright (c) 2026 Friends of Monika
#
# See LICENSE file for the licensing information
#
################################################################################

# Backward compatibility with the original Comfy UI submod: other submods may
# reference the comfy_ui store (most notably comfy_ui.theme_mgr). Redirect the
# old names to the cozy_ui store. Having the original submod installed
# alongside would end up with two UI overhauls fighting each other, so bail
# out early and loudly in that case.

# Runs at init -989: one level after submod headers register (init -990,
# where the original Comfy UI registers too - same level would race on file
# order), and before any of our theme machinery kicks in (theme manager at
# init -1, theme defines/styles at init 0, screen patches at init 999).
init -989 python in cozy_ui:
    import store

    if store.mas_submod_utils.isSubmodInstalled("Comfy UI"):
        raise RuntimeError(
            "CozyUI is designed to replace ComfyUI and will conflict with it. "
            "Please uninstall either of these submods."
        )

init 989 python in comfy_ui:
    from store import cozy_ui as _cozy_ui
    theme_mgr = _cozy_ui.theme_mgr

init 999 python in comfy_ui:
    # Mirror the remaining public attributes of the cozy_ui store (theme
    # defines like comfy_ui.common.*, path helpers etc.) under the old store
    # name, unless something already redefined them here.

    _cozy_store = renpy.python.store_dicts["store.cozy_ui"]
    _self_store = renpy.python.store_dicts["store.comfy_ui"]

    for _name in _cozy_store.keys():
        if not _name.startswith("_") and _name not in _self_store:
            _self_store[_name] = _cozy_store[_name]
