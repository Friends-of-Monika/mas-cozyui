<!-- In-story choice menu preview (Ren'Py `menu`): a centered column of themed
     choice buttons. No textbox or hotkey column. -->
<script lang="ts">
	import { backgrounds } from "#lib/preview/backgrounds";
	import { STAGE_H, STAGE_W } from "#lib/preview/layout";
	import { palette } from "#lib/preview/palette.svelte";
	import { theme } from "#lib/preview/theme.svelte";
	import { ui } from "#lib/preview/ui.svelte";

	import Stage from "../Stage.svelte";
	import ThemedButton from "../ThemedButton.svelte";

	const skyMask = $derived(theme.darkMode ? backgrounds.skyNight : backgrounds.skyDay);
	const room = $derived(theme.darkMode ? backgrounds.roomNight : backgrounds.roomDay);

	// choice_vbox spacing (definitions.rpy: choice_button_spacing = 12)
	const SPACING = 12;
	const BTN_W = 420;
	const BTN_H = 42;
	const TEXT_SIZE = 26;
	const TOP = 170;

	const items = ["Yuri.", "Sayori.", "Natsuki.", "Monika."];

	let hovered = $state<string | null>(null);

	// Easter egg: picking Monika opens the Modal tab with her own confirmation.
	function choose(item: string) {
		if (item !== "Monika.") return;
		ui.modal = { prompt: "Just Monika.", buttons: ["OK"] };
		ui.tab = "modal";
	}
</script>

<Stage>
	<img src={skyMask} alt="" class="absolute inset-0" width={STAGE_W} height={STAGE_H} />
	<img src={room} alt="" class="absolute inset-0" width={STAGE_W} height={STAGE_H} />

	<div class="absolute left-0 flex w-full flex-col items-center" style:top="{TOP}px" style:gap="{SPACING}px">
		{#each items as item (item)}
			<div
				class="relative"
				style:width="{BTN_W}px"
				style:height="{BTN_H}px"
				role="presentation"
				onpointerenter={() => (hovered = item)}
				onpointerleave={() => (hovered = null)}
				onclick={() => choose(item)}
			>
				<div class="absolute inset-0">
					<ThemedButton width={BTN_W} height={BTN_H} state={hovered === item ? "hover" : "idle"} />
				</div>
				<div
					class="preview-font absolute inset-0 flex items-center justify-center"
					style:font-size="{TEXT_SIZE}px"
					style:color={hovered === item ? palette.buttonTextHover() : palette.buttonTextIdle()}
				>
					{item}
				</div>
			</div>
		{/each}
	</div>
</Stage>
