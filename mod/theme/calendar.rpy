################################################################################
#
# Copyright (c) 2020-2021 Dominus Iniquitatis <zerosaiko@gmail.com>
# Copyright (c) 2026 Friends of Monika
#
# See LICENSE file for the licensing information
#
################################################################################

# MASFIX: monkey patch for calendar close button + theme-controlled font
init 999 python in cozy_ui.calendar:
    import store
    from renpy.text.text import Text
    from store import MASCalendar, gui

    # The month/year, weekday and day-number labels all read this class constant
    # for their color; point it at the theme's calendar text color.
    MASCalendar.DAY_NUMBER_COLOR = store.cozy_ui.calendar.text_color

    old_init = MASCalendar.__init__

    def monkey_init(self, *args, **kwargs):
        # MASCalendar picks its day/night art from the spaceroom's time-of-day
        # filter (mas_current_background.isFltDay()), so with the UI in light mode
        # at night the calendar would open dark, out of step with the rest of the
        # themed UI. Make it follow the UI's dark-mode state instead. The class'
        # isFltDay is patched only for the no-argument (current-filter) query, and
        # only for the duration of construction, so explicit-filter checks and
        # every other caller are untouched.
        bg_cls = type(store.mas_current_background)
        had_own = "isFltDay" in bg_cls.__dict__
        orig_isFltDay = bg_cls.isFltDay

        def _ui_isFltDay(self, flt=None, __orig=orig_isFltDay):
            if flt is None:
                return not getattr(store.mas_globals, "dark_mode", False)
            return __orig(self, flt)

        bg_cls.isFltDay = _ui_isFltDay

        # MASCalendar builds all of its Text displayables (title, month/year,
        # day names and numbers) with font=gui.default_font. Swap in the theme's
        # calendar font for the duration of construction so they follow the theme
        # without having to rebuild each Text afterwards, then restore it.
        original_font = gui.default_font
        gui.default_font = store.cozy_ui.calendar.font
        try:
            old_init(self, *args, **kwargs)
        finally:
            gui.default_font = original_font
            if had_own:
                bg_cls.isFltDay = orig_isFltDay
            else:
                del bg_cls.isFltDay

        empty_text = Text("")

        btn = self.button_exit
        btn._button_states = {k: (empty_text, v[1]) for k, v in btn._button_states.items()}

    MASCalendar.__init__ = monkey_init
