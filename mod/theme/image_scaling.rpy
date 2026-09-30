################################################################################
#
# Copyright (c) 2020-2021 Dominus Iniquitatis <zerosaiko@gmail.com>
# Copyright (c) 2026 Friends of Monika
#
# See LICENSE file for the licensing information
#
################################################################################
init -999 python in cozy_ui:
    import re
    import store

    from renpy.display.im import Image
    from renpy.display.transform import Transform

    # The wall calendar button. MAS picks its idle art from the room's time-of-day
    # filter and hardcodes a single (day) hover sprite, so at night the idle is
    # dark but the hover flips to the day art. Follow the UI's dark-mode state
    # instead (matching the calendar modal), and supply a night hover, by mapping
    # every calendar_button_{normal,hover}[-n].png to the current mode.
    _CAL_BUTTON_RE = re.compile(r"(calendar_button_(?:normal|hover))(?:-n)?\.png$")

    def _cozy_calendar_button(filename):
        if "calendar_button" not in filename:
            return filename
        m = _CAL_BUTTON_RE.search(filename)
        if m is None:
            return filename
        suffix = "-n" if getattr(store.mas_globals, "dark_mode", False) else ""
        return filename[:m.start()] + m.group(1) + suffix + ".png"

    _active_theme_prefix = expand_path("%SUBMOD_DIR%/themes/active")
    _replacer_prefix = expand_path("%SUBMOD_DIR%/themes/active/replacers")
    _replacer_map = {}
    _cozy_path_cache = {}

    def reload_replacers():
        """
        Scans themes/active/replacers and populates _replacer_map in memory.
        Clears Ren'Py image cache so new textures display immediately without restart.
        """
        global _replacer_map, _cozy_path_cache
        _replacer_map = {}
        _cozy_path_cache = {}

        import os
        game_dir = os.path.join(renpy.config.basedir, "game")
        replacers_dir = os.path.join(game_dir, _submod_path.replace("/", os.sep), "themes", "active", "replacers")

        if os.path.isdir(replacers_dir):
            for root, dirs, files in os.walk(replacers_dir):
                for f in files:
                    full = os.path.join(root, f)
                    rel = os.path.relpath(full, replacers_dir).replace(os.sep, "/")
                    replacer_path = _replacer_prefix + "/" + rel
                    _replacer_map[rel] = replacer_path
                    if rel.endswith(".png"):
                        _replacer_map[rel[:-4] + ".svg"] = replacer_path
                    elif rel.endswith(".svg"):
                        _replacer_map[rel[:-4] + ".png"] = replacer_path

        try:
            renpy.display.image.image_cache.clear()
            renpy.exports.free_memory()
        except Exception:
            pass

    _init_replacers = reload_replacers
    reload_replacers()

    def cozy_path(filename):
        if not filename or not isinstance(filename, basestring):
            return filename, False

        # Calendar button art depends on dark mode state; other paths are static
        is_cal = "calendar_button" in filename
        if is_cal:
            dark_mode = getattr(store.mas_globals, "dark_mode", False)
            cache_key = (filename, dark_mode)
        else:
            cache_key = filename

        cached = _cozy_path_cache.get(cache_key)
        if cached is not None:
            return cached

        resolved = _cozy_calendar_button(filename) if is_cal else filename
        norm_key = resolved.replace("\\", "/").lstrip("/")

        replacer_path = _replacer_map.get(norm_key)
        if replacer_path is not None:
            res = (replacer_path, True)
        else:
            is_cozy = norm_key.startswith(_active_theme_prefix)
            res = (resolved, is_cozy)

        _cozy_path_cache[cache_key] = res
        return res

    # HACK: monkey patch for handling an image scaling/replacement
    def monkey_new(cls, filename = "", **properties):
        filename, is_cozy_asset = cozy_path(filename)

        new_instance = super(Image, cls).__new__(cls)
        new_instance.__init__(filename, **properties)

        if is_cozy_asset:
            return Transform(new_instance, zoom = CUI_SCALE_INV())

        return new_instance

    Image.__new__ = staticmethod(monkey_new)

    # HACK: monkey patch for dynamic image path interpolation
    def monkey_dynamic_image(d, scope = None, prefix = None, *args, **kwargs):
        if not isinstance(d, list):
            d = [d]

        for i in d:
            if not isinstance(i, basestring):
                continue

            if (prefix is not None) and ("[prefix_" in i):
                if scope:
                    scope = dict(scope)
                else:
                    scope = {}

                for p in renpy.styledata.stylesets.prefix_search[prefix]:
                    scope["prefix_"] = p

                    rv = renpy.substitutions.substitute(i, scope = scope, force = True, translate = False)[0]
                    rv, _ = cozy_path(rv)

                    if renpy.loader.loadable(rv):
                        return renpy.easy.displayable_or_none(rv)

                    if renpy.exports.image_exists(rv):
                        return renpy.easy.displayable_or_none(rv)

            else:
                rv = renpy.substitutions.substitute(i, scope = scope, force = True, translate = False)[0]
                rv, _ = cozy_path(rv)

                if renpy.loader.loadable(rv):
                    return renpy.easy.displayable_or_none(rv)

                if renpy.exports.image_exists(rv):
                    return renpy.easy.displayable_or_none(rv)

        else:
            return renpy.easy.displayable_or_none(d[-1], dynamic = False)

    renpy.easy.dynamic_image = monkey_dynamic_image
