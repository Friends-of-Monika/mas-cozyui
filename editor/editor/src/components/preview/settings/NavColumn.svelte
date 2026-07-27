<!-- Left navigation column of the game menu: the screen title and the
     navigation buttons (menu font; the current page is lighter/insensitive). -->
<script lang="ts">
	import { palette } from "#lib/preview/palette.svelte";

	import OutlineText from "../OutlineText.svelte";

	// Buttons shown in-game on the settings screen (submod pages included)
	const items = [
		"History",
		"Save Game",
		"Load Game",
		"Main Menu",
		"Settings",
		"Submods",
		"API Keys",
		"Hotkeys",
		"Help",
		"Quit",
		"Return"
	];
	const current = "Settings";

	let hovered = $state<string | null>(null);

	const fill = $derived(palette.navColor());
	function outlineColor(item: string): string {
		if (item === current) return palette.navOutlineInsensitive();
		if (hovered === item) return palette.navOutlineHover();
		return palette.navOutlineIdle();
	}
</script>

<!-- Title -->
<div class="absolute" style:left="45px" style:top="34px">
	<OutlineText
		size={38}
		color={fill}
		outlines={[
			[palette.navOutlineIdle(), 6],
			[palette.navOutlineIdle(), 3]
		]}
	>
		Settings
	</OutlineText>
</div>

<!-- Navigation buttons -->
<div class="absolute flex flex-col gap-[16px]" style:left="80px" style:top="205px">
	{#each items as item (item)}
		<div role="presentation" onpointerenter={() => (hovered = item)} onpointerleave={() => (hovered = null)}>
			<OutlineText
				size={24}
				color={fill}
				outlines={[
					[outlineColor(item), 4],
					[outlineColor(item), 2]
				]}
			>
				{item}
			</OutlineText>
		</div>
	{/each}
</div>
