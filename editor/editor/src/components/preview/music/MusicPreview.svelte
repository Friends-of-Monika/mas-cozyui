<!-- MAS music menu (music_menu) preview: modal over the room, with a scrim +
     curved left panel, a title and the paginated song list. Song titles use the
     theme's music font; the bottom actions use the menu font. -->
<script lang="ts">
	import { backgrounds } from "#lib/preview/backgrounds";
	import { STAGE_H, STAGE_W } from "#lib/preview/layout";
	import { palette } from "#lib/preview/palette.svelte";
	import { theme } from "#lib/preview/theme.svelte";

	import OutlineText from "../OutlineText.svelte";
	import RealAsset from "../RealAsset.svelte";
	import Stage from "../Stage.svelte";

	const skyMask = $derived(theme.darkMode ? backgrounds.skyNight : backgrounds.skyDay);
	const room = $derived(theme.darkMode ? backgrounds.roomNight : backgrounds.roomDay);

	// First page of the song list; song 11+ spill onto page 2, so Next is live
	// and Prev is not.
	const songs = [
		"Just Monika",
		"Your Reality",
		"Your Reality (Piano Cover)",
		"Your Reality (Eurobeat ver.)",
		"I Still Love You",
		"My Feelings",
		"My Confession",
		"Okay, Everyone! (Monika)",
		"Play With Me (Variant 6)",
		"Doki Doki Theme (80s ver.)"
	];

	// Bottom navigation actions. Prev is present but insensitive on page 1.
	const hasPrev = false;
	const hasNext = true;

	let hovered = $state<string | null>(null);

	const fill = $derived(palette.navColor());
	function outlines(item: string, sensitive = true): [string, number][] {
		const c = !sensitive
			? palette.navOutlineInsensitive()
			: hovered === item
				? palette.navOutlineHover()
				: palette.navOutlineIdle();
		return [
			[c, 4],
			[c, 2]
		];
	}
</script>

{#snippet navButton(label: string, font: "menu" | "music" = "menu", sensitive = true)}
	<div role="presentation" onpointerenter={() => (hovered = label)} onpointerleave={() => (hovered = null)}>
		<OutlineText {font} size={24} color={fill} outlines={outlines(label, sensitive)}>{label}</OutlineText>
	</div>
{/snippet}

<Stage>
	<img src={skyMask} alt="" class="absolute inset-0" width={STAGE_W} height={STAGE_H} />
	<img src={room} alt="" class="absolute inset-0" width={STAGE_W} height={STAGE_H} />

	<!-- Modal scrim: 0.5 wash + curved left panel over the scene -->
	<RealAsset path="replacers/mod_assets/music_menu.svg" width={STAGE_W} height={STAGE_H} class="absolute inset-0" />

	<!-- Title (same placement as the Settings title) -->
	<div class="absolute" style:left="45px" style:top="34px">
		<OutlineText
			size={38}
			color={fill}
			outlines={[
				[palette.navOutlineIdle(), 6],
				[palette.navOutlineIdle(), 3]
			]}
		>
			Music Menu
		</OutlineText>
	</div>

	<!-- Song list, in the music font -->
	<div class="absolute flex flex-col gap-3.25" style:left="80px" style:top="150px">
		{#each songs as song (song)}
			{@render navButton(song, "music")}
		{/each}
	</div>

	<!-- Bottom actions: Prev/Next row, No Music, Return - in the menu font. -->
	<div class="absolute flex flex-col gap-4" style:left="80px" style:bottom="24px">
		<div class="flex gap-8">
			{#if hasPrev}
				{@render navButton("<<<< Prev")}
			{:else}
				{@render navButton("<<<< Prev", "menu", false)}
			{/if}
			{#if hasNext}
				{@render navButton("Next >>>>")}
			{/if}
		</div>
		{@render navButton("No Music")}
		{@render navButton("Return")}
	</div>
</Stage>
