// Shared preview UI state: the active tab and the modal dialog contents. Kept
// here (not in a component) so previews can drive each other - e.g. the Monika
// choice on the Menu tab switches to the Modal tab with its own prompt.
export const DEFAULT_MODAL = {
	prompt: "Are you sure you want to quit?",
	buttons: ["Yes", "No"]
};

export const ui = $state<{
	tab: string;
	modal: { prompt: string; buttons: string[] };
}>({
	tab: "scene",
	modal: { ...DEFAULT_MODAL }
});
