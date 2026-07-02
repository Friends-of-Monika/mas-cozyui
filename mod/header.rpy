init -990 python:
    store.mas_submod_utils.Submod(
        author="Friends of Monika",
        name="Submod Template",
        description=_("This is a template submod for other people to reuse."),
        version="1.0.0"
    )

init -989 python:
    if store.mas_submod_utils.isSubmodInstalled("Submod Updater Plugin"):
        store.sup_utils.SubmodUpdater(
            submod="Submod Template",
            user_name="friends-of-monika",
            repository_name="mas-submod-template",
            extraction_depth=2
        )