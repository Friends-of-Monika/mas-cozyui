<!-- 1280x720 MAS stage, scaled to fit its container width. Sets the preview
     font CSS variables from the live theme so nested text picks them up. -->
<script lang="ts">
	import type { Snippet } from "svelte";

	import { STAGE_H, STAGE_W } from "#lib/preview/layout";
	import { theme } from "#lib/preview/theme.svelte";

	let { children }: { children: Snippet } = $props();

	let containerW = $state(STAGE_W);
	const scale = $derived(containerW / STAGE_W);
</script>

<div class="w-full" bind:clientWidth={containerW}>
	<div style:width="{containerW}px" style:height="{STAGE_H * scale}px" class="relative overflow-hidden">
		<div
			class="absolute top-0 left-0 origin-top-left select-none"
			style:width="{STAGE_W}px"
			style:height="{STAGE_H}px"
			style:transform="scale({scale})"
			style:--preview-main-font={theme.mainFont}
			style:--preview-menu-font={theme.menuFont}
			style:--preview-option-font={theme.optionFont}
			style:--preview-music-font={theme.musicFont}
			style:--preview-calendar-font={theme.calendarFont}
		>
			{@render children()}
		</div>
	</div>
</div>
