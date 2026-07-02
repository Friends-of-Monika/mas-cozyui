################################################################################
#
# Copyright (c) 2022-2026 Friends of Monika
#
# Adapted from fom_script_path.rpy:
# https://gist.github.com/dreamscached/6b11dd9b6204915fa98ffb19fb3f162a
#
# See LICENSE file for the licensing information
#
################################################################################

init -1000 python in cozy_ui:
    import os

    def get_script_file(fallback=None, relative=False):
        """
        Uses internal Ren'Py function renpy.get_filename_line() to locate
        current script file and get its location, accounting for potential
        erroneous outputs produced by this function.

        IN:
            fallback -> str, default None:
                Path to use as a fallback in case this function fails to find
                appropriate current script location.
            relative -> bool, default False:
                True if function should omit "game/" from detected path to make
                it relative to "game/" folder.

        OUT:
            str:
                Relative (to DDLC directory) path to the .rpy script file that
                is currently being executed, or fallback value (or None if not
                provided) if this function is unable to find appropriate path.

        RAISES:
            ValueError:
                If fallback does not start with "game/" and relative is set to
                False.

        NOTE:
            For consistency between platforms paths returned always have "/"
            as folder separator, even on Windows. This function assumes the
            script is located in "game/" folder and uses this assumption in
            its path correction logic. Proper functionality cannot be
            guaranteed if called from eval() and alike dynamic code execution
            contexts.
        """

        if fallback is not None and not fallback.startswith("game/") and not relative:
            raise ValueError(
                "fallback path does not start with \"game/\" "
                "and relative is not True"
            )

        # Use renpy's developer function get_filename_line() to get current
        # script location. WARNING: THIS IS EXTREMELY UNSTABLE, THE FOLLOWING
        # CODE IS THE WORKAROUND THAT MAKES IT SOMEWHAT RELIABLE! Also replace
        # Windows \ (backslash) folder separators with / (slash) character
        # for consistency.
        path = renpy.get_filename_line()[0].replace("\\", "/")
        if os.path.isabs(path):
            # Returned path may be absolute, relativize it.
            path = os.path.relpath(path, renpy.config.renpy_base)

        # Split into path parts and check if path doesn't start with game/
        # (because if it does start with game/ - then RenPy actually gave us
        #  a good path. Rarely, but it works.)
        parts = path.split("/")
        if parts[0] != "game":
            # Keep dropping path parts and instead use game/ prefix, hoping
            # to eventually hit something like game/Submods/script.rpy instead
            # of something bizarre like lib/i686/Submods/script.rpy
            for n in range(1, len(parts)):
                parts_proc = parts[n:]
                parts_proc.insert(0, "game")

                # Looks scary here but it's simple: get together what we have
                # and check if this path exists, if it does - return it
                rel_path = "/".join(parts_proc)
                if os.path.exists(os.path.join(renpy.config.renpy_base, rel_path)):
                    result = rel_path.replace("\\", "/")
                    if relative:
                        # If we need a relative result, omit "game/" (5 chars)
                        return result[5:]
                    return result

            if fallback is not None and relative:
                # Omit game/ prefix, its presence is checked above.
                return fallback[5:]
            return fallback.replace("\\", "/") if fallback is not None else None

        else:
            if relative:
                # Simply remove leading "game" item from path parts.
                parts.pop(0)
            return "/".join(parts)

    def get_script_dir(fallback=None, relative=False):
        """
        Uses get_script_file function to get current script directory.
        See get_script_file for parameter and return value descriptions;
        this function returns the containing directory instead of the file.
        """

        if fallback is not None:
            if not fallback.endswith("/"):
                fallback += "/"
            fallback += "script.rpy"

        path = get_script_file(fallback, relative)
        if path is None:
            return None

        return "/".join(path.split("/")[:-1])

    # Game-relative path to the submod's own folder, autodetected from this
    # very script's location (this file ships in the cozy_ui/ subfolder of
    # the submod, hence the parent). Falls back to the conventional install
    # path.
    _submod_path = "/".join(
        get_script_dir("game/Submods/CozyUI/cozy_ui", relative=True)
        .split("/")[:-1]
    )

    def expand_path(path):
        """
        Expands the %SUBMOD_DIR% placeholder in asset paths (as used in theme
        definitions and built theme scripts) into the actual game/-relative
        submod path.
        """
        return path.replace("%SUBMOD_DIR%", _submod_path)
