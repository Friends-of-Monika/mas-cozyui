<!-- Hotkey buttons column (MAS hkb_overlay screen):
     vbox at xpos 0.05 anchored to bottom y715, 120x35 buttons, spacing 5 -->
<script lang="ts">
	import { HKB_BOTTOM, HKB_BTN_H, HKB_BTN_W, HKB_LEFT, HKB_SPACING } from "#lib/preview/layout";
	import { palette } from "#lib/preview/palette.svelte";

	import ThemedButton, { type ButtonState } from "../ThemedButton.svelte";

	// Reference state: only Music is interactable while the talk menu is open
	const buttons: { label: string; state: ButtonState }[] = [
		{ label: "Talk", state: "insensitive" },
		{ label: "Extra", state: "insensitive" },
		{ label: "Music", state: "idle" },
		{ label: "Play", state: "insensitive" }
	];

	const columnH = buttons.length * HKB_BTN_H + (buttons.length - 1) * HKB_SPACING;

	let hovered = $state<string | null>(null);

	function stateOf(button: { label: string; state: ButtonState }): ButtonState {
		return button.state === "idle" && hovered === button.label ? "hover" : button.state;
	}

	function textColor(state: ButtonState): string {
		if (state === "insensitive") return palette.buttonTextInsensitive();
		if (state === "hover") return palette.buttonTextHover();
		return palette.buttonTextIdle();
	}
</script>

<div
	class="absolute flex flex-col"
	style:left="{HKB_LEFT}px"
	style:top="{HKB_BOTTOM - columnH}px"
	style:gap="{HKB_SPACING}px"
>
	{#each buttons as button (button.label)}
		<div
			class="relative"
			style:width="{HKB_BTN_W}px"
			style:height="{HKB_BTN_H}px"
			role="presentation"
			onpointerenter={() => (hovered = button.label)}
			onpointerleave={() => (hovered = null)}
		>
			<div class="absolute inset-0">
				<ThemedButton width={HKB_BTN_W} height={HKB_BTN_H} state={stateOf(button)} kind="generic" />
			</div>
			<div
				class="preview-font absolute inset-0 flex items-center justify-center"
				style:font-size="22px"
				style:letter-spacing="0.2px"
				style:color={textColor(stateOf(button))}
			>
				{button.label}
			</div>
		</div>
	{/each}
</div>
