<!-- Settings check/radio row: a 28px box + label from the real theme assets.
     Selected/hovered rows show the filled check and a 9-sliced background.
     "Change Renderer" is a plain text button (no box). -->
<script lang="ts">
	import { palette } from "#lib/preview/palette.svelte";

	import NineSlice from "../NineSlice.svelte";
	import RealAsset from "../RealAsset.svelte";

	let { label, selected = false, box = true }: { label: string; selected?: boolean; box?: boolean } = $props();

	let hovered = $state(false);

	const active = $derived(selected || hovered);
	const labelColor = $derived(active ? palette.checkLabelActive() : palette.checkLabelIdle());
	const foreground = $derived(
		selected
			? "replacers/mod_assets/buttons/checkbox/selected_fancy_check.svg"
			: "replacers/mod_assets/buttons/checkbox/fancy_check.svg"
	);
</script>

<div
	class="relative flex h-9 items-center gap-2 px-1.5"
	role="presentation"
	onpointerenter={() => (hovered = true)}
	onpointerleave={() => (hovered = false)}
>
	<!-- selected/hover background (fancy_check_bg, 9-sliced) -->
	{#if active}
		<div class="absolute inset-0">
			<NineSlice path="replacers/mod_assets/buttons/checkbox/fancy_check_bg.svg" />
		</div>
	{/if}

	{#if box}
		<div class="relative shrink-0">
			<RealAsset path={foreground} width={28} height={28} />
		</div>
	{/if}

	<span
		class="preview-option-font relative leading-tight whitespace-nowrap"
		style:font-size="22px"
		style:color={labelColor}
	>
		{label}
	</span>
</div>
