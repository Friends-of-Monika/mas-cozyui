# lib/

> [!NOTE]
> This folder is *optional* and if you don't need it &mdash; feel free to remove
> it altogether, with all files inside it.

## Description

> [!WARNING]
> In one of the next updates the Submod Framework will be overhauled and it may
> get harder to import Python libraries or the approach to their import may
> change radically. Only use this functionality if you're willing to deal with
> the breaking changes later.

This folder contains optional Python libraries that you bundle along with your
submod and later (see [/mod/header.rpy]) easily import in your submod.

If you decide to use it after all, you can remove both `.gitkeep` and this
`README.md`, just make sure you don't leave an empty folder &mdash; Git doesn't
handle them and won't track changes.