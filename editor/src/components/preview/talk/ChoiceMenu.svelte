<!-- Talk prompt menu (mas_ui scrollable menu); button backgrounds from the
     CozyUI scrollable_menu_*_background.svg templates -->
<script lang="ts">
	import { MENU_BTN_H, MENU_BTN_W, MENU_LEFT, MENU_SPACING, MENU_TEXT_SIZE, MENU_TOP } from "#lib/preview/layout";
	import { palette } from "#lib/preview/palette.svelte";

	import ThemedButton from "../ThemedButton.svelte";

	// "Unseen" is rendered with the scrollable_menu_new_button (bold) style
	const items: { label: string; bold?: boolean }[] = [
		{ label: "Unseen", bold: true },
		{ label: "Hey, Monika..." },
		{ label: "Repeat conversation" },
		{ label: "I love you!" },
		{ label: "I feel..." },
		{ label: "Goodbye" },
		{ label: "Nevermind" }
	];

	let hovered = $state<string | null>(null);
</script>

<div class="absolute flex flex-col" style:left="{MENU_LEFT}px" style:top="{MENU_TOP}px" style:gap="{MENU_SPACING}px">
	{#each items as item (item.label)}
		<div
			class="relative"
			style:width="{MENU_BTN_W}px"
			style:height="{MENU_BTN_H}px"
			role="presentation"
			onpointerenter={() => (hovered = item.label)}
			onpointerleave={() => (hovered = null)}
		>
			<div class="absolute inset-0">
				<ThemedButton
					width={MENU_BTN_W}
					height={MENU_BTN_H}
					state={hovered === item.label ? "hover" : "idle"}
				/>
			</div>
			<div
				class="preview-font absolute inset-0 flex items-center justify-center"
				style:font-size="{MENU_TEXT_SIZE}px"
				style:font-weight={item.bold ? "bold" : "normal"}
				style:color={hovered === item.label ? palette.buttonTextHover() : palette.buttonTextIdle()}
			>
				{item.label}
			</div>
		</div>
	{/each}
</div>
