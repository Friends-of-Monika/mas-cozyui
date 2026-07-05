<!-- MAS confirm-screen preview. The room is dimmed by the confirm overlay
     (gui/overlay/confirm.svg), with a themed frame (gui/frame.svg, drawn as a
     9-slice so its corners track frame_rounding) holding the prompt and the
     Yes/No buttons. Buttons use the same outlined menu-font style as the game
     menu navigation (see NavColumn), matching DDLC. No hotkey column here. -->
<script lang="ts">
	import { backgrounds } from "#lib/preview/backgrounds";
	import { STAGE_H, STAGE_W } from "#lib/preview/layout";
	import { palette } from "#lib/preview/palette.svelte";
	import { theme } from "#lib/preview/theme.svelte";
	import { ui } from "#lib/preview/ui.svelte";
	import { buttonSlice } from "#lib/theme/macros";

	import NineSlice from "../NineSlice.svelte";
	import OutlineText from "../OutlineText.svelte";
	import RealAsset from "../RealAsset.svelte";
	import Stage from "../Stage.svelte";

	const skyMask = $derived(theme.darkMode ? backgrounds.skyNight : backgrounds.skyDay);
	const room = $derived(theme.darkMode ? backgrounds.roomNight : backgrounds.roomDay);

	// The frame is a 9-slice, so its border slice follows frame_rounding the same
	// way button slices follow button_rounding.
	const frameSlice = $derived(buttonSlice(theme.frameRounding));

	let hovered = $state<string | null>(null);

	const navFill = $derived(palette.navColor());
	const navOutline = (label: string) => (hovered === label ? palette.navOutlineHover() : palette.navOutlineIdle());
</script>

<Stage>
	<img src={skyMask} alt="" class="absolute inset-0" width={STAGE_W} height={STAGE_H} />
	<img src={room} alt="" class="absolute inset-0" width={STAGE_W} height={STAGE_H} />

	<!-- Dim overlay -->
	<RealAsset path="replacers/gui/overlay/confirm.svg" width={STAGE_W} height={STAGE_H} class="absolute inset-0" />

	<!-- Confirm frame, centered and sized to its content -->
	<div class="absolute inset-0 flex items-center justify-center">
		<div class="relative">
			<div class="absolute inset-0">
				<NineSlice path="replacers/gui/frame.svg" slice={frameSlice} />
			</div>

			<div class="relative flex min-w-[320px] flex-col items-center justify-center gap-10 px-16 py-12">
				<div class="preview-font text-center" style:font-size="26px" style:color={palette.buttonTextIdle()}>
					{ui.modal.prompt}
				</div>
				<div class="flex gap-12">
					{#each ui.modal.buttons as label (label)}
						<div
							role="presentation"
							onpointerenter={() => (hovered = label)}
							onpointerleave={() => (hovered = null)}
						>
							<OutlineText
								size={30}
								color={navFill}
								outlines={[
									[navOutline(label), 5],
									[navOutline(label), 2]
								]}
							>
								{label}
							</OutlineText>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</Stage>
