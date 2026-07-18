################################################################################
#
# Copyright (c) 2020-2021 Dominus Iniquitatis <zerosaiko@gmail.com>
# Copyright (c) 2026 Friends of Monika
#
# See LICENSE file for the licensing information
#
################################################################################

init -10 python in cozy_ui:
    import json
    import os
    import shutil
    import store

    from zipfile import ZipFile

    # _submod_path is autodetected in script_path.rpy at init -1000
    _game_dir = os.path.join(renpy.config.basedir, "game")
    _submod_dir = os.path.join(_game_dir, *_submod_path.split("/"))
    _themes_dir = os.path.join(_submod_dir, "themes")
    _active_dir = os.path.join(_themes_dir, "active")
    _config_path = os.path.join(_themes_dir, "settings.json")

    _default_settings = {
        "selected_theme_index": 0,
        "use_fonts": True,
        "use_layout": True,
        "use_hidpi": False
    }

    class ThemeManager(object):
        def __init__(self):
            if not os.path.isdir(_themes_dir):
                os.makedirs(_themes_dir)

            self.settings = {}
            self.settings.update(_default_settings)
            self._themes = []
            self._fetch_themes()
            self.load_settings()

        def disable(self):
            self._remove_current_theme()

        def get_current_theme(self):
            return self._themes[self.settings["selected_theme_index"]]

        def get_current_theme_name(self):
            return self.get_current_theme()["name"]

        def get_current_theme_preview(self):
            return self.get_current_theme()["preview"]

        def get_theme_count(self):
            return len(self._themes)

        def current_has_base(self):
            return self.get_current_theme()["path"] is not None

        def current_has_hidpi(self):
            return self.get_current_theme()["hidpi_path"] is not None

        # Which variant actually gets installed for the current theme: HiDPI when
        # the user wants it and it exists, or when there is no base variant.
        def use_hidpi_effective(self):
            theme = self.get_current_theme()
            if self.settings["use_hidpi"] and theme["hidpi_path"] is not None:
                return True
            return theme["path"] is None

        def install(self):
            self._remove_current_theme()
            self._install_theme(self.get_current_theme())

        def load_settings(self):
            if not os.path.exists(_config_path):
                return

            with open(_config_path, "r") as file:
                self.settings.update(json.load(file))

        def save_settings(self):
            with open(_config_path, "w") as file:
                json.dump(self.settings, file, indent = 4, sort_keys = False)

        def _log(self, msg, level="info"):
            log_func = getattr(store.mas_submod_utils.submod_log, level)
            log_func("[CozyUI] %s" % str(msg))

        def _fetch_themes(self):
            # Group the .zip files by theme id, tracking each variant separately.
            # A theme may ship only a base variant, only a _hidpi one, or both.
            variants = {}
            for file_path in os.listdir(_themes_dir):
                file_name, file_ext = os.path.splitext(file_path)

                if file_ext != ".zip":
                    continue

                full_path = os.path.join(_themes_dir, file_path)

                if file_name.endswith("_hidpi"):
                    theme_id = file_name[:-len("_hidpi")]
                    variants.setdefault(theme_id, {"path": None, "hidpi_path": None})["hidpi_path"] = full_path
                else:
                    variants.setdefault(file_name, {"path": None, "hidpi_path": None})["path"] = full_path

            for paths in variants.values():
                # Read the metadata/preview from whichever variant is present.
                info_source = paths["path"] or paths["hidpi_path"]
                theme_info = self._get_theme_info(info_source, paths["path"], paths["hidpi_path"])
                self._themes.append(theme_info)

            # FIXME: there should be a better way to put the Default theme above the others
            def comparator(x):
                name = x["name"]

                if name == "Default":
                    return "  %s" % name
                elif name == "Classic":
                    return " %s" % name

                return name

            self._themes.sort(key = comparator)

        def _get_theme_info(self, info_source, path, hidpi_path):
            result = {
                "path": path,
                "hidpi_path": hidpi_path
            }

            with ZipFile(info_source, "r") as theme_arc:
                with theme_arc.open("info.json", "r") as info_json:
                    result.update(json.load(info_json))

                preview_path = theme_arc.extract("preview.png", _themes_dir)

                theme_preview_file_name = "%s_preview.png" % result["id"]
                theme_preview_path = os.path.join(_themes_dir, theme_preview_file_name)

                if os.path.exists(theme_preview_path):
                    os.remove(theme_preview_path)

                os.rename(preview_path, theme_preview_path)

                result["preview"] = "%s/themes/%s" % (_submod_path, theme_preview_file_name)

            return result

        def _install_theme(self, theme):
            ignored_files = [
                "info.json",
                "preview.png"
            ]

            if not self.settings["use_fonts"]:
                ignored_files.append("fonts.rpy")

            if not self.settings["use_layout"]:
                ignored_files.append("layout.rpy")

            # Prefer HiDPI when requested and available; otherwise fall back to
            # whichever variant this theme actually ships.
            if self.settings["use_hidpi"] and theme["hidpi_path"] is not None:
                theme_path = theme["hidpi_path"]
            else:
                theme_path = theme["path"] or theme["hidpi_path"]

            with ZipFile(theme_path, "r") as theme_arc:
                for file_path in theme_arc.namelist():
                    if os.path.basename(file_path) in ignored_files:
                        self._log("Skipping %s..." % file_path)
                        continue

                    self._log("Installing %s..." % file_path)
                    theme_arc.extract(file_path, _active_dir)

            self._log("Theme installed.")

        def _remove_current_theme(self):
            if os.path.isdir(_active_dir):
                self._log("Removing %s..." % _active_dir)
                shutil.rmtree(_active_dir)

            self._log("Theme removed.")

init -1 python in cozy_ui:
    theme_mgr = ThemeManager()
