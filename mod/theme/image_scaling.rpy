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
        m = _CAL_BUTTON_RE.search(filename)
        if m is None:
            return filename
        suffix = "-n" if getattr(store.mas_globals, "dark_mode", False) else ""
        return filename[:m.start()] + m.group(1) + suffix + ".png"

    def cozy_path(filename):
        filename = _cozy_calendar_button(filename)
        replacer_filename = expand_path("%SUBMOD_DIR%/themes/active/replacers") + "/%s" % filename

        has_replacement = renpy.loadable(replacer_filename)
        is_cozy_asset = filename.startswith(expand_path("%SUBMOD_DIR%/themes/active")) or has_replacement

        if has_replacement:
            filename = replacer_filename

        return filename, is_cozy_asset

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
