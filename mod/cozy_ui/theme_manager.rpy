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
            # A theme that was removed (or that failed to load) leaves a stale
            # index behind in settings.json.
            index = self.settings["selected_theme_index"]

            if index >= len(self._themes):
                index = 0
                self.settings["selected_theme_index"] = index

            return self._themes[index]

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

                try:
                    theme_info = self._get_theme_info(info_source, paths["path"], paths["hidpi_path"])
                except Exception as e:
                    # Themes are user-supplied files; a broken one must not take
                    # the submod (and with it the whole game) down at init time.
                    # Name the file in the log so it can be found and removed.
                    self._log(
                        "Skipping broken theme file '%s': %s" % (os.path.basename(info_source), e),
                        level = "error"
                    )
                    continue

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

        # A theme archive is expected to be flat, with info.json at its root, but
        # one that was unpacked and re-zipped (Windows Explorer does this) nests
        # everything in a folder, so find info.json and take its folder as root.
        def _get_theme_root(self, theme_arc):
            candidates = [
                file_path for file_path in theme_arc.namelist()
                if file_path.rsplit("/", 1)[-1] == "info.json"
            ]

            if not candidates:
                raise ValueError("archive contains no info.json, is it a theme?")

            root = min(candidates, key = lambda file_path: file_path.count("/"))
            return root[:-len("info.json")]

        def _get_theme_info(self, info_source, path, hidpi_path):
            result = {
                "path": path,
                "hidpi_path": hidpi_path
            }

            with ZipFile(info_source, "r") as theme_arc:
                root = self._get_theme_root(theme_arc)

                with theme_arc.open(root + "info.json", "r") as info_json:
                    result.update(json.load(info_json))

                theme_preview_file_name = "%s_preview.png" % result["id"]
                theme_preview_path = os.path.join(_themes_dir, theme_preview_file_name)

                with open(theme_preview_path, "wb") as preview_file:
                    preview_file.write(theme_arc.read(root + "preview.png"))

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
                root = self._get_theme_root(theme_arc)

                for file_path in theme_arc.namelist():
                    if file_path.endswith("/") or not file_path.startswith(root):
                        continue

                    # Install relative to the archive root, so a nested theme
                    # lands in active/ directly instead of active/<folder>/.
                    rel_path = file_path[len(root):]

                    if os.path.basename(rel_path) in ignored_files:
                        self._log("Skipping %s..." % rel_path)
                        continue

                    self._log("Installing %s..." % rel_path)
                    self._extract(theme_arc, file_path, rel_path)

            self._log("Theme installed.")

        def _extract(self, theme_arc, member, rel_path):
            parts = rel_path.split("/")

            # Themes come from the internet; never let one write outside active/.
            if os.path.isabs(rel_path) or ".." in parts:
                self._log("Refusing to extract %s..." % rel_path, level = "warning")
                return

            dest_path = os.path.join(_active_dir, *parts)
            dest_dir = os.path.dirname(dest_path)

            if not os.path.isdir(dest_dir):
                os.makedirs(dest_dir)

            with open(dest_path, "wb") as dest_file:
                dest_file.write(theme_arc.read(member))

        def _remove_current_theme(self):
            if os.path.isdir(_active_dir):
                self._log("Removing %s..." % _active_dir)
                shutil.rmtree(_active_dir)

            self._log("Theme removed.")

init -1 python in cozy_ui:
    theme_mgr = ThemeManager()
