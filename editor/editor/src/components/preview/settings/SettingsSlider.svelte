<!-- Preference slider: a menu-font label (optionally with a value) and the
     themed track and thumb, from the real assets. -->
<script lang="ts">
	import { palette } from "#lib/preview/palette.svelte";

	import OutlineText from "../OutlineText.svelte";
	import RealAsset from "../RealAsset.svelte";

	let { label, value, fraction }: { label: string; value?: string; fraction: number } = $props();

	// menu_label styling: white fill, secondary outline (3px + 1px)
	const labelColor = $derived(palette.labelColor());
	const outlines = $derived<[string, number][]>([
		[palette.labelOutline(), 3],
		[palette.labelOutline(), 1]
	]);

	const barPath = "replacers/gui/slider/horizontal_idle_bar.svg";
	const thumbPath = "replacers/gui/slider/horizontal_idle_thumb.svg";

	const trackW = 300;
	const trackH = 18;
	const thumbW = 16;
	const thumbH = 17;
</script>

<div class="flex flex-col gap-1">
	<div>
		<OutlineText size={22} color={labelColor} {outlines} font="menu">
			{label}{value ? `: ${value}` : ""}
		</OutlineText>
	</div>
	<div class="relative" style:width="{trackW}px" style:height="{trackH}px">
		<div class="absolute inset-0">
			<RealAsset path={barPath} width={trackW} height={trackH} />
		</div>
		<div
			class="absolute -top-1 -translate-x-1/2"
			style:left="{fraction * trackW}px"
			style:width="{thumbW}px"
			style:height="{thumbH}px"
		>
			<RealAsset path={thumbPath} width={thumbW} height={thumbH} />
		</div>
	</div>
</div>
