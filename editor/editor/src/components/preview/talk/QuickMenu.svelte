<!-- Quick menu: hbox centered at
     yalign 0.995, 14px labels; colors from CozyUI quick_button_text -->
<script lang="ts">
	import { QUICK_BOTTOM, QUICK_GAP, QUICK_TEXT_SIZE, STAGE_W } from "#lib/preview/layout";
	import { palette } from "#lib/preview/palette.svelte";

	// Skip is insensitive while at the main interaction prompt
	const items: { label: string; insensitive?: boolean }[] = [
		{ label: "History" },
		{ label: "Skip", insensitive: true },
		{ label: "Auto" },
		{ label: "Save" },
		{ label: "Load" },
		{ label: "Settings" }
	];

	let hovered = $state<string | null>(null);

	function itemColor(item: { label: string; insensitive?: boolean }): string {
		if (item.insensitive) return palette.quickInsensitive();
		if (hovered === item.label) return palette.quickHover();
		return palette.quickIdle();
	}
</script>

<div
	class="preview-font absolute flex -translate-x-1/2 -translate-y-full"
	style:left="{STAGE_W / 2}px"
	style:top="{QUICK_BOTTOM}px"
	style:gap="{QUICK_GAP}px"
	style:font-size="{QUICK_TEXT_SIZE}px"
	style:letter-spacing="0.2px"
	style:line-height="1"
>
	{#each items as item (item.label)}
		<span
			role="presentation"
			style:color={itemColor(item)}
			onpointerenter={() => (hovered = item.label)}
			onpointerleave={() => (hovered = null)}
		>
			{item.label}
		</span>
	{/each}
</div>
