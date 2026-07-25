<!-- MAS music selection screen (music_menu) preview, themed live. Unlike the
     game menu, this screen is modal over the room: the scene shows through a
     translucent scrim (mod_assets/music_menu.svg: a 0.5 wash + the curved left
     panel), with a "Music Menu" title and the paginated song list on top. Song
     buttons and the Prev/Next/No Music/Return actions all use the
     navigation_button text styling (menu font, secondary fill + outline
     brightening on hover) - which is what CozyUI themes
     music_menu_button_text/return_button to. The in-game song list uses a fixed
     M+ 2p font (not theme-controlled, so not reproduced here); the menu font is
     used as a stand-in. -->
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

	// First page of the non-sayori song list (initMusicChoices order). PAGE_LIMIT
	// is 10, so the eleventh song (Surprise!) spills onto page 2 - hence Next is
	// live and Prev is not.
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

{#snippet navButton(label: string, sensitive = true)}
	<div role="presentation" onpointerenter={() => (hovered = label)} onpointerleave={() => (hovered = null)}>
		<OutlineText size={24} color={fill} outlines={outlines(label, sensitive)}>{label}</OutlineText>
	</div>
{/snippet}

<Stage>
	<img src={skyMask} alt="" class="absolute inset-0" width={STAGE_W} height={STAGE_H} />
	<img src={room} alt="" class="absolute inset-0" width={STAGE_W} height={STAGE_H} />

	<!-- Modal scrim: 0.5 wash + curved left panel over the scene -->
	<RealAsset path="replacers/mod_assets/music_menu.svg" width={STAGE_W} height={STAGE_H} class="absolute inset-0" />

	<!-- Title (game_menu_label, same placement as the Settings title) -->
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

	<!-- Song list (vbox at gui.navigation_xpos) -->
	<div class="absolute flex flex-col gap-3.25" style:left="80px" style:top="150px">
		{#each songs as song (song)}
			{@render navButton(song)}
		{/each}
	</div>

	<!-- Bottom actions (vbox yalign 1.0): Prev/Next row, No Music, Return -->
	<div class="absolute flex flex-col gap-4" style:left="80px" style:bottom="24px">
		<div class="flex gap-8">
			{#if hasPrev}
				{@render navButton("<<<< Prev")}
			{:else}
				{@render navButton("<<<< Prev", false)}
			{/if}
			{#if hasNext}
				{@render navButton("Next >>>>")}
			{/if}
		</div>
		{@render navButton("No Music")}
		{@render navButton("Return")}
	</div>
</Stage>
