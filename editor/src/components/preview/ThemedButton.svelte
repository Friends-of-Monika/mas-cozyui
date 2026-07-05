<!-- Themed button background: the real button SVG rendered as a Frame 9-slice.
     - kind "menu": choice/talk buttons (button/<state>_bg_lt|dk.svg)
     - kind "generic": hotkey buttons (mod_assets/buttons/generic/<state>_bg[_d].svg) -->
<script lang="ts">
	import { theme } from "#lib/preview/theme.svelte";

	import NineSlice from "./NineSlice.svelte";

	export type ButtonState = "idle" | "hover" | "insensitive" | "selected";

	let {
		width,
		height,
		state = "idle",
		kind = "menu"
	}: { width: number; height: number; state?: ButtonState; kind?: "menu" | "generic" } = $props();

	const path = $derived.by(() => {
		if (kind === "menu") {
			// button/ only ships idle/hover/insensitive; selected reuses idle.
			// Light/dark uses the _lt/_dk suffix, so NineSlice's _d swap is bypassed.
			const s = state === "selected" ? "idle" : state;
			return `button/${s}_bg_${theme.darkMode ? "dk" : "lt"}.svg`;
		}
		return `replacers/mod_assets/buttons/generic/${state}_bg.svg`;
	});
</script>

<NineSlice {path} {width} {height} />
